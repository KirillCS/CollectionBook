using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Items.Commands.CreateItem
{
    public class CreateItemCommand : IRequest<int>
    {
        public string Name { get; set; }

        public int CollectionId { get; set; }
    }

    public class CreateItemCommandHandler : IRequestHandler<CreateItemCommand, int>
    {
        private readonly UserManager<User> userManager;
        private readonly ICurrentUserService currentUserService;
        private readonly IApplicationDbContext context;

        public CreateItemCommandHandler(UserManager<User> userManager, ICurrentUserService currentUserService, IApplicationDbContext context)
        {
            this.userManager = userManager;
            this.currentUserService = currentUserService;
            this.context = context;
        }

        public async Task<int> Handle(CreateItemCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(currentUserService.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException(nameof(User)));

            Collection collection = await context.Collections.FindAsync(request.CollectionId);
            Guard.Requires(() => collection is not null, new EntityNotFoundException(nameof(Collection)));

            Guard.Requires(() => collection.UserId == user.Id, new OperationException(403));

            var item = new Item() { Name = request.Name, CollectionId = request.CollectionId };
            await context.Items.AddAsync(item, cancellationToken);
            await context.SaveChanges(cancellationToken);

            return item.Id;
        }
    }
}

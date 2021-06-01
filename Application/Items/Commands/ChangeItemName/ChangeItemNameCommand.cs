using Application.Common.Attributes;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Items.Commands.ChangeItemName
{
    [Authorize]
    public class ChangeItemNameCommand : IRequest
    {
        public int Id { get; set; }

        public string NewName { get; set; }
    }

    public class ChangeItemNameCommandHandler : IRequestHandler<ChangeItemNameCommand>
    {
        private readonly IApplicationDbContext context;
        private readonly ICurrentUserService currentUserService;

        public ChangeItemNameCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            this.context = context;
            this.currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(ChangeItemNameCommand request, CancellationToken cancellationToken)
        {
            Item item = await context.Items.Include(i => i.Collection).FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);
            Guard.Requires(() => item is not null, new EntityNotFoundException());

            string userId = currentUserService.Id;
            Guard.Requires(() => userId == item.Collection.UserId, new OperationException(403));

            item.Name = request.NewName;
            await context.SaveChanges(cancellationToken);

            return Unit.Value;
        }
    }
}

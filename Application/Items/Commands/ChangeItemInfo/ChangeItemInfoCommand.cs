using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Items.Commands.ChangeItemInfo
{
    public class ChangeItemInfoCommand : IRequest
    {
        public int Id { get; set; }

        public string NewInfo { get; set; }
    }

    public class ChangeItemInfoCommandHandler : IRequestHandler<ChangeItemInfoCommand>
    {
        private readonly IApplicationDbContext context;
        private readonly ICurrentUserService currentUserService;

        public ChangeItemInfoCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            this.context = context;
            this.currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(ChangeItemInfoCommand request, CancellationToken cancellationToken)
        {
            Item item = await context.Items.Include(i => i.Collection).FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);
            Guard.Requires(() => item is not null, new EntityNotFoundException());

            string userId = currentUserService.Id;
            Guard.Requires(() => userId == item.Collection.UserId, new OperationException(403));

            item.Information = request.NewInfo;
            await context.SaveChanges(cancellationToken);

            return Unit.Value;
        }
    }
}

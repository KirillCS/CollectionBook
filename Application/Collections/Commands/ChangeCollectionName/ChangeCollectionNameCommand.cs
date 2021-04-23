using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Collections.Commands.ChangeCollectionName
{
    public class ChangeCollectionNameCommand : IRequest
    {
        public int Id { get; set; }

        public string NewName { get; set; }
    }

    public class ChangeCollectionNameCommandHandler : IRequestHandler<ChangeCollectionNameCommand>
    {
        private readonly IApplicationDbContext context;
        private readonly ICurrentUserService currentUserService;

        public ChangeCollectionNameCommandHandler(IApplicationDbContext context,
                                                  ICurrentUserService currentUserService)
        {
            this.context = context;
            this.currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(ChangeCollectionNameCommand request, CancellationToken cancellationToken)
        {
            Collection collection = await context.Collections.FindAsync(request.Id);
            Guard.Requires(() => collection is not null, new EntityNotFoundException());

            Guard.Requires(() => collection.UserId == currentUserService.Id, new OperationException(403));

            collection.Name = request.NewName;
            await context.SaveChanges(cancellationToken);

            return Unit.Value;
        }
    }
}

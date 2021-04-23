using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Collections.Commands.ChangeCollectionDescription
{
    public class ChangeCollectionDescriptionCommand : IRequest
    {
        public int Id { get; set; }

        public string NewDescription { get; set; }
    }

    public class ChangeCollectionDescriptionCommandHandler : IRequestHandler<ChangeCollectionDescriptionCommand>
    {
        private readonly IApplicationDbContext context;
        private readonly ICurrentUserService currentUserService;

        public ChangeCollectionDescriptionCommandHandler(IApplicationDbContext context,
                                                         ICurrentUserService currentUserService)
        {
            this.context = context;
            this.currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(ChangeCollectionDescriptionCommand request, CancellationToken cancellationToken)
        {
            Collection collection = await context.Collections.FindAsync(request.Id);
            Guard.Requires(() => collection is not null, new EntityNotFoundException());

            Guard.Requires(() => collection.UserId == currentUserService.Id, new OperationException(403));

            collection.Description = request.NewDescription.Trim();
            await context.SaveChanges(cancellationToken);

            return Unit.Value;
        }
    }
}

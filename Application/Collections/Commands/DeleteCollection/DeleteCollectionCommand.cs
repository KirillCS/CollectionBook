using Application.Common.Attributes;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Collections.Commands.DeleteCollection
{
    [Authorize]
    public class DeleteCollectionCommand : IRequest
    {
        public int Id { get; set; }
    }

    public class DeleteCollectionCommandHandler : IRequestHandler<DeleteCollectionCommand>
    {
        private readonly IApplicationDbContext context;
        private readonly ICurrentUserService currentUserService;
        private readonly IFileService fileService;

        public DeleteCollectionCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService, IFileService fileService)
        {
            this.context = context;
            this.currentUserService = currentUserService;
            this.fileService = fileService;
        }

        public async Task<Unit> Handle(DeleteCollectionCommand request, CancellationToken cancellationToken)
        {
            Collection collection = context.Collections.FirstOrDefault(c => c.Id == request.Id);
            if (collection is null)
            {
                return Unit.Value;
            }

            Guard.Requires(() => currentUserService.Id == collection.UserId, new OperationException(403));

            if (collection.CoverPath is not null)
            {
                fileService.Remove(collection.CoverPath);
            }

            context.Collections.Remove(collection);
            await context.SaveChanges(cancellationToken);

            return Unit.Value;
        }
    }
}

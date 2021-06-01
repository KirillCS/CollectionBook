using Application.Common.Attributes;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Collections.Commands.ChangeCollectionCover
{
    [Authorize]
    public class ChangeCollectionCoverCommand : IRequest<string>
    {
        public int Id { get; set; }

        public IFormFile Cover { get; set; }
    }

    public class ChangeCollectionCoverCommandHandler : IRequestHandler<ChangeCollectionCoverCommand, string>
    {
        private readonly IApplicationDbContext context;
        private readonly ICurrentUserService currentUserService;
        private readonly IFileExtensionsService fileExtensionsService;

        public ChangeCollectionCoverCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService, IFileExtensionsService fileExtensionsService)
        {
            this.context = context;
            this.currentUserService = currentUserService;
            this.fileExtensionsService = fileExtensionsService;
        }

        public async Task<string> Handle(ChangeCollectionCoverCommand request, CancellationToken cancellationToken)
        {
            Collection collection = await context.Collections.FindAsync(request.Id);
            Guard.Requires(() => collection is not null, new EntityNotFoundException());

            Guard.Requires(() => collection.UserId == currentUserService.Id, new OperationException(403));

            string newCoverPath = await fileExtensionsService.UpdateCollectionCover(request.Cover, collection.CoverPath);
            collection.CoverPath = newCoverPath;
            await context.SaveChanges(cancellationToken);
            
            return newCoverPath;
        }
    }
}

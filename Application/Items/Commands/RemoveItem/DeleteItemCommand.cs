using Application.Common.Attributes;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Items.Commands.RemoveItem
{
    [Authorize]
    public class DeleteItemCommand : IRequest
    {
        public int Id { get; set; }
    }

    class DeleteItemCommandHandler : IRequestHandler<DeleteItemCommand>
    {
        private readonly IApplicationDbContext context;
        private readonly ICurrentUserService currentUserService;
        private readonly IFileService fileService;

        public DeleteItemCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService, IFileService fileService)
        {
            this.context = context;
            this.currentUserService = currentUserService;
            this.fileService = fileService;
        }

        public async Task<Unit> Handle(DeleteItemCommand request, CancellationToken cancellationToken)
        {
            Item item = await context.Items.Include(i => i.Collection).Include(i => i.Images).FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);

            if (item is null)
            {
                return Unit.Value;
            }

            string userId = currentUserService.Id;
            Guard.Requires(() => userId == item.Collection.UserId, new OperationException(403));

            foreach (ItemImage image in item.Images)
            {
                fileService.Remove(image.Path);
            }

            context.Items.Remove(item);
            await context.SaveChanges(cancellationToken);

            return Unit.Value;
        }
    }
}

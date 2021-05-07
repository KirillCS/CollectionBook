using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Items.Commands.RemoveItemImage
{
    public class RemoveItemImageCommand : IRequest
    {
        public int ImageId { get; set; }
    }

    public class RemoveItemImageCommandHandler : IRequestHandler<RemoveItemImageCommand>
    {
        private readonly IApplicationDbContext context;
        private readonly ICurrentUserService currentUserService;
        private readonly IFileService fileService;

        public RemoveItemImageCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService, IFileService fileService)
        {
            this.context = context;
            this.currentUserService = currentUserService;
            this.fileService = fileService;
        }

        public async Task<Unit> Handle(RemoveItemImageCommand request, CancellationToken cancellationToken)
        {
            ItemImage image = await context.ItemImages.Include(i => i.Item)
                                                      .ThenInclude(i => i.Collection)
                                                      .FirstOrDefaultAsync(i => i.Id == request.ImageId, cancellationToken);

            if (image is null)
            {
                return Unit.Value;
            }

            Guard.Requires(() => currentUserService.Id == image.Item.Collection.UserId, new OperationException(403));

            this.fileService.Remove(image.Path);
            context.ItemImages.Remove(image);
            await context.SaveChanges(cancellationToken);

            return Unit.Value;
        }
    }
}

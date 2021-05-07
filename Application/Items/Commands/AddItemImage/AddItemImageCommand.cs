using Application.Common.Dto;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Items.Commands.AddItemImage
{
    public class AddItemImageCommand : IRequest<ImageDto>
    {
        public int Id { get; set; }

        public IFormFile Image { get; set; }
    }

    public class AddItemImageCommandHandler : IRequestHandler<AddItemImageCommand, ImageDto>
    {
        private readonly IApplicationDbContext context;
        private readonly ICurrentUserService currentUserService;
        private readonly IFileExtensionsService fileService;
        private readonly IMapper mapper;

        public AddItemImageCommandHandler(IApplicationDbContext context,
                                          ICurrentUserService currentUserService, 
                                          IFileExtensionsService fileService,
                                          IMapper mapper)
        {
            this.context = context;
            this.currentUserService = currentUserService;
            this.fileService = fileService;
            this.mapper = mapper;
        }

        public async Task<ImageDto> Handle(AddItemImageCommand request, CancellationToken cancellationToken)
        {
            Item item = await context.Items.Include(i => i.Collection).FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);
            Guard.Requires(() => item is not null, new EntityNotFoundException());

            string userId = currentUserService.Id;
            Guard.Requires(() => userId == item.Collection.UserId, new OperationException(403));

            string imagePath = await fileService.SaveItemImage(request.Image);
            ItemImage itemImage = new ItemImage() { ItemId = request.Id, Path = imagePath };

            await context.ItemImages.AddAsync(itemImage, cancellationToken);
            await context.SaveChanges(cancellationToken);

            return mapper.Map<ImageDto>(itemImage);
        }
    }
}

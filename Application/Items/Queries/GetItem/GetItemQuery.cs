using Application.Common.Dto;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Items.Queries.GetItem
{
    public class GetItemQuery : IRequest<ItemDto>
    {
        public int Id { get; set; }
    }

    public class GetItemQueryHandler : IRequestHandler<GetItemQuery, ItemDto>
    {
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public GetItemQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<ItemDto> Handle(GetItemQuery request, CancellationToken cancellationToken)
        {
            Item item = await context.Items.Include(i => i.Tags)
                                        .Include(i => i.Images)
                                        .Include(i => i.Collection)
                                        .ThenInclude(i => i.User)
                                        .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);

            Guard.Requires(() => item is not null, new EntityNotFoundException());

            ItemDto itemDto = mapper.Map<ItemDto>(item);
            itemDto.User = mapper.Map<UserLoginDto>(item.Collection.User);

            return itemDto;
        }
    }
}

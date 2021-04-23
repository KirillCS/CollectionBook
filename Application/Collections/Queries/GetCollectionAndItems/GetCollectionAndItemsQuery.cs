using Application.Common.Dto;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Collections.Queries.GetCollectionAndItems
{
    public class GetCollectionAndItemsQuery : IRequest<CollectionPageDto>
    {
        public int Id { get; set; }
    }

    public class GetCollectionAndItemsQueryHandler : IRequestHandler<GetCollectionAndItemsQuery, CollectionPageDto>
    {
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public GetCollectionAndItemsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<CollectionPageDto> Handle(GetCollectionAndItemsQuery request, CancellationToken cancellationToken)
        {
            Collection collection = context.Collections
                                           .Include(c => c.User)
                                           .Include(c => c.Tags)
                                           .Include(c => c.Stars)
                                           .FirstOrDefault(c => c.Id == request.Id);

            Guard.Requires(() => collection is not null, new EntityNotFoundException());

            return mapper.Map<CollectionPageDto>(collection);
        }
    }
}

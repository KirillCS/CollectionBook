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

namespace Application.Collections.Queries.GetCollection
{
    public class GetCollectionQuery : IRequest<CollectionDto>
    {
        public int Id { get; set; }
    }

    public class GetCollectionQueryHandler : IRequestHandler<GetCollectionQuery, CollectionDto>
    {
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public GetCollectionQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<CollectionDto> Handle(GetCollectionQuery request, CancellationToken cancellationToken)
        {
            Collection collection = await context.Collections
                                                 .Include(c => c.Items)
                                                 .Include(c => c.User)
                                                 .Include(c => c.Tags)
                                                 .Include(c => c.Stars)
                                                 .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            Guard.Requires(() => collection is not null, new EntityNotFoundException());

            return mapper.Map<CollectionDto>(collection);
        }
    }
}

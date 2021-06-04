using Application.Common.Dto;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Statistics.Queries.GetTopCollections
{
    public class GetTopCollectionsQuery : TopQuery, IRequest<IEnumerable<TopCollectionDto>>
    {
    }

    public class GetTopCollectionsQueryHandler : IRequestHandler<GetTopCollectionsQuery, IEnumerable<TopCollectionDto>>
    {
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public GetTopCollectionsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<TopCollectionDto>> Handle(GetTopCollectionsQuery request, CancellationToken cancellationToken) =>
            await Task.Run(() => context.Collections.ProjectTo<TopCollectionDto>(mapper.ConfigurationProvider)
                                                    .OrderByDescending(d => d.StarsCount)
                                                    .ThenBy(d => d.Name)
                                                    .Take(request.Count));
    }
}

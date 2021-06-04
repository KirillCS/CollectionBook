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

namespace Application.Statistics.Queries.GetTopTags
{
    public class GetTopTagsQuery : TopQuery, IRequest<IEnumerable<TopTagDto>>
    {
    }

    public class GetTopTagsQueryHandler : IRequestHandler<GetTopTagsQuery, IEnumerable<TopTagDto>>
    {
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public GetTopTagsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<TopTagDto>> Handle(GetTopTagsQuery request, CancellationToken cancellationToken) =>
            await Task.Run(() => context.Tags.ProjectTo<TopTagDto>(mapper.ConfigurationProvider)
                                             .Where(t => t.Count != 0)
                                             .OrderByDescending(t => t.Count)
                                             .ThenBy(t => t.Label)
                                             .Take(request.Count));
    }
}

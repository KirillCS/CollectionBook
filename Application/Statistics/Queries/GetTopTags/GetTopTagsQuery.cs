using Application.Common.Interfaces;
using Application.Common.Responses;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Statistics.Queries.GetTopTags
{
    public class GetTopTagsQuery : IRequest<IEnumerable<TopTagsResponse>>
    {
        private readonly int count;

        public int Count 
        { 
            get => count; 
            init
            {
                if (value < 0)
                {
                    value = 0;
                }

                count = value;
            }
        }
    }

    public class GetTopTagsQueryHandler : IRequestHandler<GetTopTagsQuery, IEnumerable<TopTagsResponse>>
    {
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public GetTopTagsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<TopTagsResponse>> Handle(GetTopTagsQuery request, CancellationToken cancellationToken) =>
            context.Tags.ProjectTo<TopTagsResponse>(mapper.ConfigurationProvider)
                        .Where(t => t.Count != 0)
                        .OrderByDescending(t => t.Count)
                        .ThenBy(t => t.Label)
                        .Take(request.Count);
    }
}

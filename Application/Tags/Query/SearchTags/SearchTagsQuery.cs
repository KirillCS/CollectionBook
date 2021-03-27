using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Tags.Query.SearchTags
{
    public class SearchTagsQuery : IRequest<IEnumerable<string>>
    {
        public string SearchString { get; set; }

        public int ReturnedCount { get; set; }
    }

    public class SearchTagsQueryHandler : IRequestHandler<SearchTagsQuery, IEnumerable<string>>
    {
        private readonly IApplicationDbContext dbContext;

        public SearchTagsQueryHandler(IApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<IEnumerable<string>> Handle(SearchTagsQuery request, CancellationToken cancellationToken)
        {
            return await dbContext.Tags.Where(tag => tag.Label.Contains(request.SearchString))
                                       .Take(request.ReturnedCount)
                                       .Select(tag => tag.Label)
                                       .ToListAsync(cancellationToken);
        }
    }
}

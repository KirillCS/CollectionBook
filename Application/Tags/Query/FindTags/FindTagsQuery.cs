using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Tags.Query.FindTags
{
    public class FindTagsQuery : IRequest<IEnumerable<string>>
    {
        public string SearchString { get; set; }

        public int Count { get; set; }
    }

    public class FindTagsQueryHandler : IRequestHandler<FindTagsQuery, IEnumerable<string>>
    {
        private readonly IApplicationDbContext dbContext;

        public FindTagsQueryHandler(IApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<IEnumerable<string>> Handle(FindTagsQuery request, CancellationToken cancellationToken)
        {
            return await dbContext.Tags.Where(tag => tag.Label.Contains(request.SearchString))
                                       .Take(request.Count)
                                       .Select(tag => tag.Label)
                                       .ToListAsync(cancellationToken);
        }
    }
}

using Application.Common.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Tags.Query.FindTags
{
    public class FindTagsQuery : IRequest<IEnumerable<string>>
    {
        private string searchString = string.Empty;

        public string SearchString 
        { 
            get => searchString;
            set => searchString = value ?? string.Empty; 
        }

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
            string searchString = request.SearchString.ToLowerInvariant();
            if (string.IsNullOrEmpty(searchString))
            {
                return Array.Empty<string>();
            }

            return await Task.Run(() => dbContext.Tags.Where(tag => tag.Label.ToLower().StartsWith(searchString))
                                                      .Take(request.Count)
                                                      .Select(tag => tag.Label)
                                                      .OrderBy(tag => tag));
        }
    }
}

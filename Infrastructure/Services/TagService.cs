using Application.Common.Interfaces;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class TagService : ITagService
    {
        private readonly IApplicationDbContext dbContext;

        public TagService(IApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<IEnumerable<Tag>> AddTags(IEnumerable<string> tags)
        {
            var newTags = tags.Where(t => !string.IsNullOrEmpty(t) && dbContext.Tags.Any(ct => t != ct.Label)).Select(t => new Tag { Label = t });
            await dbContext.Tags.AddRangeAsync(newTags);

            return dbContext.Tags.Where(t => tags.Contains(t.Label));
        }
    }
}

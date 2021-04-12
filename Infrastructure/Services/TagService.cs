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

        public async Task<IEnumerable<Tag>> Add(IEnumerable<string> tags)
        {
            tags = tags.Distinct();
            IQueryable<Tag> oldTags = dbContext.Tags.Where(t => tags.Contains(t.Label));
            IEnumerable<Tag> newTags = tags.Where(t => !oldTags.Any(ot => t == ot.Label)).Select(t => new Tag { Label = t });
            await dbContext.Tags.AddRangeAsync(newTags);
            await dbContext.SaveChanges(default);

            return dbContext.Tags.Where(t => tags.Contains(t.Label));
        }
    }
}

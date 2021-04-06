using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Models
{
    public class PaginatedList<T>
    {
        public IList<T> Items { get; }

        public int TotalCount { get; }

        public PaginatedList(IList<T> items, int count)
        {
            TotalCount = count;
            Items = items;
        }

        public static async Task<PaginatedList<T>> Create(IQueryable<T> source, int pageIndex, int pageSize)
        {
            int count = await source.CountAsync();
            IList<T> items = await source.Skip(pageIndex * pageSize).Take(pageSize).ToListAsync();

            return new PaginatedList<T>(items, count);
        }
    }

    public static class QueryableExtension
    {
        public static Task<PaginatedList<TDestination>> ToPaginatedList<TDestination>(this IQueryable<TDestination> queryable, int pageIndex, int pageSize)
            => PaginatedList<TDestination>.Create(queryable, pageIndex, pageSize);
    }
}

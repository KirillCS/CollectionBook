using Domain.Entities;
using System;
using System.Linq;

namespace Application.Items.Queries.FindItems
{
    public enum ItemsSortCriterion
    {
        ByPopularity,
        ByAlphabetUp,
        ByAlphabetDown,
        ByCreationTimeDown,
        ByCreationTimeUp
    }

    internal static class ItemsSortExtensions
    {
        public static IQueryable<Item> SortBy(this IQueryable<Item> collections, ItemsSortCriterion criterion) =>
            criterion switch
            {
                ItemsSortCriterion.ByPopularity => collections.OrderByDescending(i => i.Collection.Stars.Count).ThenBy(i => i.Name),
                ItemsSortCriterion.ByAlphabetUp => collections.OrderBy(i => i.Name),
                ItemsSortCriterion.ByAlphabetDown => collections.OrderByDescending(i => i.Name),
                ItemsSortCriterion.ByCreationTimeDown => collections.OrderByDescending(i => i.CreationTime).ThenBy(i => i.Name),
                ItemsSortCriterion.ByCreationTimeUp => collections.OrderBy(i => i.CreationTime).ThenBy(c => c.Name),
                _ => throw new NotImplementedException($"Criterion {criterion} of the {nameof(ItemsSortCriterion)} enum is not implemented")
            };
    }
}

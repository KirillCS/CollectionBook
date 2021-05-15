using Domain.Entities;
using System;
using System.Linq;

namespace Application.Collections.Queries.FindCollections
{
    public enum CollectionsSortCriterion
    {
        ByPopularity,
        ByFullness,
        ByAlphabetUp,
        ByAlphabetDown,
        ByCreationTimeDown,
        ByCreationTimeUp
    }

    internal static class CollectionSortExtensions
    {
        public static IQueryable<Collection> SortBy(this IQueryable<Collection> collections, CollectionsSortCriterion criterion) =>
            criterion switch
            {
                CollectionsSortCriterion.ByPopularity => collections.OrderByDescending(c => c.Stars.Count).ThenBy(c => c.Name),
                CollectionsSortCriterion.ByFullness => collections.OrderByDescending(c => c.Items.Count).ThenBy(c => c.Name),
                CollectionsSortCriterion.ByAlphabetUp => collections.OrderBy(c => c.Name),
                CollectionsSortCriterion.ByAlphabetDown => collections.OrderByDescending(c => c.Name),
                CollectionsSortCriterion.ByCreationTimeDown => collections.OrderByDescending(c => c.CreationTime).ThenBy(c => c.Name),
                CollectionsSortCriterion.ByCreationTimeUp => collections.OrderBy(c => c.CreationTime).ThenBy(c => c.Name),
                _ => throw new NotImplementedException($"Criterion {criterion} of the {nameof(CollectionsSortCriterion)} enum is not implemented")
            };
    }
}

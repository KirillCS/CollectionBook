using Domain.Entities;
using System;
using System.Linq;

namespace Application.Collections.Queries.FindCollections
{
    public enum CollectionSortCriterion
    {
        PopularityAscending,
        PopularityDescending,
        AlphabetAscending,
        AlphabetDescending,
        CreationTimeAscending,
        CreationTimeDescending,
        ItemsCountAscending,
        ItemsCountDescending,
    }

    internal static class CollectionSortExtensions
    {
        public static IQueryable<Collection> SortBy(this IQueryable<Collection> collections, CollectionSortCriterion criterion) =>
            criterion switch
            {
                CollectionSortCriterion.PopularityAscending => collections.OrderBy(c => c.Stars.Count),
                CollectionSortCriterion.PopularityDescending => collections.OrderByDescending(c => c.Stars.Count),
                CollectionSortCriterion.AlphabetAscending => collections.OrderBy(c => c.Name),
                CollectionSortCriterion.AlphabetDescending => collections.OrderByDescending(c => c.Name),
                CollectionSortCriterion.CreationTimeAscending => collections.OrderBy(c => c.CreationTime),
                CollectionSortCriterion.CreationTimeDescending => collections.OrderByDescending(c => c.CreationTime),
                CollectionSortCriterion.ItemsCountAscending => collections.OrderBy(c => c.Items.Count),
                CollectionSortCriterion.ItemsCountDescending => collections.OrderByDescending(c => c.Items.Count),
                _ => throw new NotImplementedException($"Criterion {criterion} of the {nameof(CollectionSortCriterion)} enum is not implemented")
            };
    }
}

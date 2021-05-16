using Domain.Entities;
using System;
using System.Linq;

namespace Application.Users.Queries.FindUsers
{
    public enum UsersSortCriterion
    {
        ByCollectionsCount,
        ByAlphabetUp,
        ByAlphabetDown
    }

    internal static class UsersSortExtensions
    {
        public static IQueryable<User> SortBy(this IQueryable<User> collections, UsersSortCriterion criterion) =>
            criterion switch
            {
                UsersSortCriterion.ByCollectionsCount => collections.OrderByDescending(u => u.Collections.Count).ThenBy(u => u.UserName),
                UsersSortCriterion.ByAlphabetUp => collections.OrderBy(i => i.UserName),
                UsersSortCriterion.ByAlphabetDown => collections.OrderByDescending(i => i.UserName),
                _ => throw new NotImplementedException($"Criterion {criterion} of the {nameof(UsersSortCriterion)} enum is not implemented")
            };
    }
}

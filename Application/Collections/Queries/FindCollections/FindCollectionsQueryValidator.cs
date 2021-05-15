using Application.Common.Enums;
using FluentValidation;

namespace Application.Collections.Queries.FindCollections
{
    public class FindCollectionsQueryValidator : AbstractValidator<FindCollectionsQuery>
    {
        public FindCollectionsQueryValidator()
        {
            RuleFor(q => q.SearchCriterion).IsInEnum().WithMessage(q => $"Enum {nameof(SearchCriterion)} doesn't contain a value {q.SearchCriterion}");
            RuleFor(q => q.SortCriterion).IsInEnum().WithMessage(q => $"Enum {nameof(CollectionsSortCriterion)} doesn't contain a value {q.SortCriterion}");
        }
    }
}

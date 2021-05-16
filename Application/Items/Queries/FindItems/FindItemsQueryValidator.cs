using Application.Common.Enums;
using FluentValidation;

namespace Application.Items.Queries.FindItems
{
    public class FindItemsQueryValidator : AbstractValidator<FindItemsQuery>
    {
        public FindItemsQueryValidator()
        {
            RuleFor(q => q.SearchCriterion).IsInEnum().WithMessage(q => $"Enum {nameof(SearchCriterion)} doesn't contain a value {q.SearchCriterion}");
            RuleFor(q => q.SortCriterion).IsInEnum().WithMessage(q => $"Enum {nameof(ItemsSortCriterion)} doesn't contain a value {q.SortCriterion}");
        }
    }
}

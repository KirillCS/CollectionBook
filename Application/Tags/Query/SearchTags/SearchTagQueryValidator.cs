using FluentValidation;

namespace Application.Tags.Query.SearchTags
{
    public class SearchTagQueryValidator : AbstractValidator<SearchTagsQuery>
    {
        public SearchTagQueryValidator()
        {
            RuleFor(q => q.Count).GreaterThan(-1).WithMessage("Returned count must be more or equal 0");
        }
    }
}

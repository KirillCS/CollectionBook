using FluentValidation;

namespace Application.Tags.Query.FindTags
{
    public class FindTagQueryValidator : AbstractValidator<FindTagsQuery>
    {
        public FindTagQueryValidator()
        {
            RuleFor(q => q.Count).GreaterThan(-1).WithMessage("Returned count must be more or equal 0");
        }
    }
}

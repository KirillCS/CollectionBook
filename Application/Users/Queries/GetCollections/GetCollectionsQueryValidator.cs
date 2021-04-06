using FluentValidation;

namespace Application.Users.Queries.GetCollections
{
    public class GetCollectionsQueryValidator : AbstractValidator<GetCollectionsQuery>
    {
        public GetCollectionsQueryValidator()
        {
            RuleFor(q => q.PageSize).Must(s => s > 0).WithMessage("Page size cannot equal zero or be negative");

            RuleFor(q => q.PageIndex).Must(i => i >= 0).WithMessage("Page index cannot be negative");
        }
    }
}

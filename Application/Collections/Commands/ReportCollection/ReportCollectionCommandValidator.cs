using FluentValidation;

namespace Application.Collections.Commands.ReportCollection
{
    public class ReportCollectionCommandValidator : AbstractValidator<ReportCollectionCommand>
    {
        public ReportCollectionCommandValidator()
        {
            RuleFor(c => c.ReportDescription).NotEmpty().WithMessage("Report description cannot be empty")
                                             .MaximumLength(1028).WithMessage("Length of a report description cannot be more 1028 symbols");
        }
    }
}

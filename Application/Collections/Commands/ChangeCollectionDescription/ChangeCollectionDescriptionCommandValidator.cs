using FluentValidation;

namespace Application.Collections.Commands.ChangeCollectionDescription
{
    public class ChangeCollectionDescriptionCommandValidator : AbstractValidator<ChangeCollectionDescriptionCommand>
    {
        public ChangeCollectionDescriptionCommandValidator()
        {
            RuleFor(c => c.NewDescription).MaximumLength(4096).WithMessage("The collection description length cannot be more 4096 symbols");
        }
    }
}

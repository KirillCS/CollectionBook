using FluentValidation;

namespace Application.Items.Commands.ChangeItemInfo
{
    public class ChangeItemInfoCommandValidator : AbstractValidator<ChangeItemInfoCommand>
    {
        public ChangeItemInfoCommandValidator()
        {
            RuleFor(c => c.NewInfo).MaximumLength(4096).WithMessage("Item info length cannot be more than 4096 symbols");
        }
    }
}

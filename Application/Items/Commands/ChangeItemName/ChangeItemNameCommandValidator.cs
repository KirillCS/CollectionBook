using FluentValidation;

namespace Application.Items.Commands.ChangeItemName
{
    public class ChangeItemNameCommandValidator : AbstractValidator<ChangeItemNameCommand>
    {
        public ChangeItemNameCommandValidator()
        {
            RuleFor(c => c.NewName).NotEmpty().WithMessage("Item name cannot be empty.")
                                   .MaximumLength(256).WithMessage("Item name length cannot be more than 256 symbols");
        }
    }
}

using FluentValidation;

namespace Application.Items.Commands.CreateItem
{
    public class CreateItemCommandValidator : AbstractValidator<CreateItemCommand>
    {
        public CreateItemCommandValidator()
        {
            RuleFor(c => c.Name).NotEmpty().WithMessage("Item name cannot be empty");
        }
    }
}

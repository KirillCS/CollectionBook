using FluentValidation;

namespace Application.UserEmail.Commands.ConfirmEmailUpdating
{
    public class ConfirmEmailUpdatingValidator : AbstractValidator<ConfirmEmailUpdatingCommand>
    {
        public ConfirmEmailUpdatingValidator()
        {
            RuleFor(c => c.Email).NotEmpty().WithMessage("Email is empty")
                                 .Matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$").WithMessage("Not valid email");
        }
    }
}

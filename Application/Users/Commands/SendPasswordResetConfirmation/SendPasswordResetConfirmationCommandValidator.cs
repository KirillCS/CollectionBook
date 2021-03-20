using FluentValidation;

namespace Application.Users.Commands.SendPasswordResetConfirmation
{
    public class SendPasswordResetConfirmationCommandValidator: AbstractValidator<SendPasswordResetConfirmationCommand>
    {
        public SendPasswordResetConfirmationCommandValidator()
        {
            RuleFor(c => c.Email).NotEmpty().WithMessage("Email is a required field")
                                 .Matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$").WithMessage("Not valid email");
        }
    }
}

using FluentValidation;

namespace Application.UserEmail.Commands.ConfirmEmail
{
    public class ConfirmEmailCommandValidator : AbstractValidator<ConfirmEmailCommand>
    {
        public ConfirmEmailCommandValidator()
        {
            RuleFor(c => c.Token).NotEmpty().WithMessage("Token is empty");
        }
    }
}

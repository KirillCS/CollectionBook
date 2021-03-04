using FluentValidation;

namespace Application.Auth.Commands.Login
{
    public class LoginCommandValidator : AbstractValidator<LoginCommand>
    {
        public LoginCommandValidator()
        {
            RuleFor(c => c.Login).NotEmpty().WithMessage("Login is a required field");

            RuleFor(c => c.Password).NotEmpty().WithMessage("Password is a required field");
        }
    }
}

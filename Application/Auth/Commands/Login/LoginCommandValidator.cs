using FluentValidation;

namespace Application.Auth.Commands.Login
{
    public class LoginCommandValidator : AbstractValidator<LoginCommand>
    {
        public LoginCommandValidator()
        {
            RuleFor(c => c.Login).NotEmpty().WithMessage("Login is a required field")
                                 .MaximumLength(256).WithMessage("Login cannot have the length more than 256 characters");

            RuleFor(c => c.Password).NotEmpty().WithMessage("Password is a required field");
        }
    }
}

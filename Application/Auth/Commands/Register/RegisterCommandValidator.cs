using FluentValidation;

namespace Application.Auth.Commands.Register
{
    class RegisterCommandValidator : AbstractValidator<RegisterCommand>
    {
        public RegisterCommandValidator()
        {
            RuleFor(c => c.Login).NotNull().NotEmpty().WithMessage("Login is a required field")
                                 .MaximumLength(256).WithMessage("Login cannot have the length more than 256 characters");

            RuleFor(c => c.Password).NotNull().NotEmpty().WithMessage("Password is a required field");

            RuleFor(c => c.PasswordConfirmation).NotNull().NotEmpty().WithMessage("Password must be confirmed")
                                                .Equal(c => c.Password).WithMessage("Password mismatch");
        }
    }
}

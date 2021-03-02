using Application.Common.Interfaces;
using FluentValidation;

namespace Application.Auth.Commands.Register
{
    public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
    {
        public RegisterCommandValidator(IUserService userService)
        {
            RuleFor(c => c.Login).NotNull().NotEmpty().WithMessage("Login is a required field")
                                 .MaximumLength(256).WithMessage("Login cannot have the length more than 256 characters")
                                 .MustAsync(async (login, ct) => !await userService.UserNameExists(login)).WithMessage(c => $"Login '{c.Login}' already exists");

            RuleFor(c => c.Password).NotNull().NotEmpty().WithMessage("Password is a required field");

            RuleFor(c => c.PasswordConfirmation).NotNull().NotEmpty().WithMessage("Password must be confirmed")
                                                .Equal(c => c.Password).When(c => !IsPasswordFieldsEmpty(c), ApplyConditionTo.CurrentValidator).WithMessage("Password mismatch");
        }

        private bool IsPasswordFieldsEmpty(RegisterCommand command) =>
            string.IsNullOrEmpty(command.Password) || string.IsNullOrEmpty(command.PasswordConfirmation);
    }
}

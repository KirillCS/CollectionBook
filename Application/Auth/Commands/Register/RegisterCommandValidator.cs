using Application.Common.Interfaces;
using FluentValidation;

namespace Application.Auth.Commands.Register
{
    public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
    {
        public RegisterCommandValidator(IUserService userService)
        {
            RuleFor(c => c.Login).NotEmpty().WithMessage("Login is a required field")
                                 .Matches(@"/^\w*$/gm").WithMessage("Login can only contain english letters, numbers and symbol '_'")
                                 .MaximumLength(256).WithMessage("Login cannot have the length more than 256 characters")
                                 .MustAsync(async (login, ct) => !await userService.UserNameExists(login)).WithMessage(c => $"Login '{c.Login}' already exists");

            RuleFor(c => c.Password).NotEmpty().WithMessage("Password is a required field")
                                    .MinimumLength(6).WithMessage("Password minimum length is 6 symbols");

            RuleFor(c => c.PasswordConfirmation).NotEmpty().WithMessage("Password must be confirmed")
                                                .Equal(c => c.Password).When(c => !IsPasswordFieldsEmpty(c), ApplyConditionTo.CurrentValidator).WithMessage("Password mismatch");
        }

        private bool IsPasswordFieldsEmpty(RegisterCommand command) =>
            string.IsNullOrEmpty(command.Password) || string.IsNullOrEmpty(command.PasswordConfirmation);
    }
}

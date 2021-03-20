using Application.Common.Interfaces;
using FluentValidation;

namespace Application.Auth.Commands.Register
{
    public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
    {
        public RegisterCommandValidator(IIdentityService identityService)
        {
            RuleFor(c => c.Login).NotEmpty().WithMessage("Login is a required field")
                                 .Matches(@"^[a-zA-Z0-9-_.]+$").WithMessage("Login can only contain english letters, numbers and symbols '_', '-', '.'")
                                 .MaximumLength(256).WithMessage("Login cannot have the length more than 256 characters")
                                 .MustAsync(async (login, ct) => !await identityService.LoginExists(login)).WithMessage(c => $"Login '{c.Login}' already exists");

            RuleFor(c => c.Email).NotEmpty().WithMessage("Email is a required field")
                                 .Matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$").WithMessage("Not valid email")
                                 .MustAsync(async (email, ct) => !await identityService.EmailExists(email)).WithMessage(c => $"User with email '{c.Email}' already exists");

            RuleFor(c => c.Password).NotEmpty().WithMessage("Password is a required field")
                                    .MinimumLength(6).WithMessage("Password minimum length is 6 symbols")
                                    .Matches("^(?=.*[a-z])(?=.*?[A-Z])(?=.*\\d)([a-zA-Z\\d]|.){6,}$").WithMessage("Password must contain at least one lowercase english letter, one uppercase english letter and one number");

            RuleFor(c => c.PasswordConfirmation).NotEmpty().WithMessage("Password must be confirmed")
                                                .Equal(c => c.Password).When(c => !(string.IsNullOrEmpty(c.Password) || string.IsNullOrEmpty(c.PasswordConfirmation)), ApplyConditionTo.CurrentValidator).WithMessage("Password mismatch");
        }
    }
}

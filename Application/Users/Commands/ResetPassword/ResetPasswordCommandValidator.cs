using FluentValidation;

namespace Application.Users.Commands.ResetPassword
{
    public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
    {
        public ResetPasswordCommandValidator()
        {
            RuleFor(c => c.Password).NotEmpty().WithMessage("Password is a required field")
                                   .MinimumLength(6).WithMessage("Password minimum length is 6 symbols")
                                   .Matches("^(?=.*[a-z])(?=.*?[A-Z])(?=.*\\d)([a-zA-Z\\d]|.){6,}$").WithMessage("Password must contain at least one lowercase english letter, one uppercase english letter and one number");

            RuleFor(c => c.PasswordConfirmation).NotEmpty().WithMessage("Password must be confirmed")
                                                .Equal(c => c.Password).When(c => !(string.IsNullOrEmpty(c.Password) || string.IsNullOrEmpty(c.PasswordConfirmation)), ApplyConditionTo.CurrentValidator).WithMessage("Password mismatch");
        }
    }
}

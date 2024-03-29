﻿using Application.Common.Interfaces;
using FluentValidation;

namespace Application.Users.Commands.UpdatePassword
{
    public class UpdatePasswordCommandValidator : AbstractValidator<UpdatePasswordCommand>
    {
        public UpdatePasswordCommandValidator(IUserService userService, ICurrentUserService currentUserService)
        {
            RuleFor(c => c.CurrentPassword).NotEmpty().WithMessage("Current password is a required field")
                                           .MustAsync(async (p, ct) => await userService.CheckPassword(currentUserService.Id, p)).WithMessage("Неправильный пароль");

            RuleFor(c => c.NewPassword).NotEmpty().WithMessage("New password is a required field")
                                    .MinimumLength(6).WithMessage("Password minimum length is 6 symbols")
                                    .Matches("^(?=.*[a-z])(?=.*?[A-Z])(?=.*\\d)([a-zA-Z\\d]|.){6,}$").WithMessage("Password must contain at least one lowercase english letter, one uppercase english letter and one number");

            RuleFor(c => c.PasswordConfirmation).NotEmpty().WithMessage("Password must be confirmed")
                                                .Equal(c => c.NewPassword).When(c => !(string.IsNullOrEmpty(c.NewPassword) || string.IsNullOrEmpty(c.PasswordConfirmation)), ApplyConditionTo.CurrentValidator).WithMessage("Password mismatch");
        }
    }
}

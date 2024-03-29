﻿using Application.Common.Interfaces;
using FluentValidation;

namespace Application.Users.Commands.UpdateLogin
{
    public class UpdateLoginCommandValidator : AbstractValidator<UpdateLoginCommand>
    {
        public UpdateLoginCommandValidator(IUserService userService)
        {
            RuleFor(c => c.Login).NotEmpty().WithMessage("Login is a required field")
                                 .Matches(@"^[a-zA-Z0-9-_.]+$").WithMessage("Login can only contain english letters, numbers and symbols '_', '-', '.'")
                                 .MaximumLength(256).WithMessage("Login cannot have the length more than 256 characters")
                                 .MustAsync(async (login, ct) => !await userService.LoginExists(login)).WithMessage(c => $"Пользователь с логином \"{c.Login}\" уже существует");
        }
    }
}

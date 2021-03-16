﻿using Application.Common.Interfaces;
using FluentValidation;

namespace Application.Users.Commands.UpdateEmail
{
    public class UpdateEmailValidator : AbstractValidator<UpdateEmailCommand>
    {
        public UpdateEmailValidator(IUserService userService)
        {
            RuleFor(c => c.Email).NotEmpty().WithMessage("Email is a required field")
                                 .Matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$").WithMessage("Not valid email")
                                 .MustAsync(async (email, ct) => !await userService.EmailExists(email)).WithMessage(c => $"User with email '{c.Email}' already exists");
        }
    }
}

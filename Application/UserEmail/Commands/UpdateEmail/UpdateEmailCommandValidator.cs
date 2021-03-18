﻿using Application.Common.Interfaces;
using FluentValidation;

namespace Application.UserEmail.Commands.UpdateEmail
{
    public class UpdateEmailCommandValidator : AbstractValidator<UpdateEmailCommand>
    {
        public UpdateEmailCommandValidator(IIdentityService identityService)
        {
            RuleFor(c => c.Email).NotEmpty().WithMessage("Email is a required field")
                                 .Matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$").WithMessage("Not valid email")
                                 .MustAsync(async (email, ct) => !await identityService.EmailExists(email)).WithMessage(c => $"User with email '{c.Email}' already exists");
        }
    }
}
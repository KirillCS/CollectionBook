using Application.Common.Interfaces;
using FluentValidation;

namespace Application.UserEmail.Commands.ChangeUnconfirmedEmail
{
    public class ChangeUnconfirmedEmailCommandValidator: AbstractValidator<ChangeUnconfirmedEmailCommand>
    {
        public ChangeUnconfirmedEmailCommandValidator(IIdentityService identityService)
        {
            RuleFor(c => c.Email).NotEmpty().WithMessage("Email cannot be empty")
                                 .Matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$").WithMessage("Not valid email")
                                 .MustAsync(async (email, ct) => !await identityService.EmailExists(email)).WithMessage(c => $"User with email '{c.Email}' already exists");
        }
    }
}

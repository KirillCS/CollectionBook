using Application.Common.Interfaces;
using FluentValidation;

namespace Application.UserEmail.Commands.ConfirmEmailUpdating
{
    public class UpdateEmailCommandValidator : AbstractValidator<UpdateEmailCommand>
    {
        public UpdateEmailCommandValidator(IUserService userService)
        {
            RuleFor(c => c.Email).NotEmpty().WithMessage("Email is empty")
                                 .Matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$").WithMessage("Not valid email")
                                 .MustAsync(async (email, ct) => !await userService.EmailExists(email)).WithMessage(c => $"Пользователь с почтой \"{c.Email}\" уже существует");

            RuleFor(c => c.Token).NotEmpty().WithMessage("Token is empty");
        }
    }
}

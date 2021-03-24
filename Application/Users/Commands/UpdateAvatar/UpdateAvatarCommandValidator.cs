using FluentValidation;

namespace Application.Users.Commands.UpdateAvatar
{
    public class UpdateAvatarCommandValidator : AbstractValidator<UpdateAvatarCommand>
    {
        public UpdateAvatarCommandValidator()
        {
            RuleFor(c => c.AvatarPath).NotEmpty().WithMessage("Avatar path cannot be empty.");
        }
    }
}

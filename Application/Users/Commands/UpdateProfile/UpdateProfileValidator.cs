using FluentValidation;

namespace Application.Users.Commands.UpdateProfile
{
    public class UpdateProfileValidator : AbstractValidator<UpdateProfileCommand>
    {
        public UpdateProfileValidator()
        {
            RuleFor(c => c.FirstName).MaximumLength(128).WithMessage("Maximum first name length is 128");

            RuleFor(c => c.LastName).MaximumLength(128).WithMessage("Maximum last name length is 128");

            RuleFor(c => c.Location).MaximumLength(256).WithMessage("Maximum location length is 256");
        }
    }
}

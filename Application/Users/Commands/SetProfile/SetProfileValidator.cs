using FluentValidation;

namespace Application.Users.Commands.SetProfile
{
    public class SetProfileValidator : AbstractValidator<SetProfileCommand>
    {
        public SetProfileValidator()
        {
            RuleFor(c => c.FirstName).MaximumLength(128).WithMessage("Maximum first name length is 128");

            RuleFor(c => c.LastName).MaximumLength(128).WithMessage("Maximum last name length is 128");

            RuleFor(c => c.Location).MaximumLength(256).WithMessage("Maximum location length is 256");
        }
    }
}

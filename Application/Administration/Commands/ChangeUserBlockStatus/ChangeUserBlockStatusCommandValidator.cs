using FluentValidation;

namespace Application.Administration.Commands.ChangeUserBlockStatus
{
    public class ChangeUserBlockStatusCommandValidator : AbstractValidator<ChangeUserBlockStatusCommand>
    {
        public ChangeUserBlockStatusCommandValidator()
        {
            RuleFor(c => c.BlockReason).Must((c, r) => !c.NewBlockStatus || (c.NewBlockStatus && !string.IsNullOrEmpty(r))).WithMessage("When an user is blocked a block reason must exist");
        }
    }
}

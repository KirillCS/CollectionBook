using FluentValidation;

namespace Application.Administration.Commands.DeleteCollection
{
    public class DeleteCollectionCommandValidator : AbstractValidator<DeleteCollectionCommand>
    {
        public DeleteCollectionCommandValidator()
        {
            RuleFor(c => c.Reason).NotEmpty().WithMessage("You must enter a reason of deleting a collection");
        }
    }
}

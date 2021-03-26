using FluentValidation;

namespace Application.Collections.Commands.CreateCollection
{
    public class CreateCollectionCommandValidator : AbstractValidator<CreateCollectionCommand>
    {
        public CreateCollectionCommandValidator()
        {
            RuleFor(c => c.Name).NotEmpty().WithMessage("Collection name is a required field")
                                .MaximumLength(256).WithMessage("Maximum length of a collection name is 256 characters");

            RuleFor(c => c.Description).MaximumLength(4096).WithMessage("Maximum length of a collection description is 4096 characters");
        }
    }
}

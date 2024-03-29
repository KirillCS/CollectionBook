﻿using FluentValidation;

namespace Application.Collections.Commands.ChangeCollectionName
{
    public class ChangeCollectionNameCommandValidator : AbstractValidator<ChangeCollectionNameCommand>
    {
        public ChangeCollectionNameCommandValidator()
        {
            RuleFor(c => c.NewName).NotEmpty().WithMessage("You must enter new name")
                                   .MaximumLength(256).WithMessage("Maximum length of the collection name is 256");
        }
    }
}

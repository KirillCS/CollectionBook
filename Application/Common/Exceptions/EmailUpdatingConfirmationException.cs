using System;
using System.Collections.Generic;

namespace Application.Common.Exceptions
{
    public class EmailUpdatingConfirmationException : Exception
    {
        public IEnumerable<string> Errors { get; } = Array.Empty<string>();

        public EmailUpdatingConfirmationException() : base("Failed to confirm email updating")
        { }

        public EmailUpdatingConfirmationException(IEnumerable<string> errors) : this()
        {
            Errors = errors;
        }
    }
}

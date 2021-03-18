using System;
using System.Collections.Generic;

namespace Application.Common.Exceptions
{
    public class UpdateEmailException : Exception
    {
        public IEnumerable<string> Errors { get; } = Array.Empty<string>();

        public UpdateEmailException() : base("Failed to change email")
        { }

        public UpdateEmailException(IEnumerable<string> errors) : this()
        {
            Errors = errors;
        }
    }
}

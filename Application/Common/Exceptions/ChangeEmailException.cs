using System;
using System.Collections.Generic;

namespace Application.Common.Exceptions
{
    public class ChangeEmailException : Exception
    {
        public IEnumerable<string> Errors { get; } = Array.Empty<string>();

        public ChangeEmailException() : base("Failed to change email")
        { }

        public ChangeEmailException(IEnumerable<string> errors) : this()
        {
            Errors = errors;
        }
    }
}

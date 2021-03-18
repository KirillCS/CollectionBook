using System;
using System.Collections.Generic;

namespace Application.Common.Exceptions
{
    public class UpdateLoginException : Exception
    {
        public IEnumerable<string> Errors { get; } = Array.Empty<string>();

        public UpdateLoginException() : base("Failed to change login")
        { }

        public UpdateLoginException(IEnumerable<string> errors) : this()
        {
            Errors = errors;
        }
    }
}

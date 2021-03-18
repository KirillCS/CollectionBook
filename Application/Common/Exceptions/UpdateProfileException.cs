using System;
using System.Collections.Generic;

namespace Application.Common.Exceptions
{
    public class UpdateProfileException : Exception
    {
        public IEnumerable<string> Errors { get; } = Array.Empty<string>();

        public UpdateProfileException() :base("Failed to update profile")
        { }

        public UpdateProfileException(IEnumerable<string> errors) : this()
        {
            Errors = errors;
        }
    }
}

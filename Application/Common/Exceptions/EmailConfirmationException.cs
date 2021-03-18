﻿using System;
using System.Collections.Generic;

namespace Application.Common.Exceptions
{
    public class EmailConfirmationException : Exception
    {
        public IEnumerable<string> Errors { get; } = Array.Empty<string>();

        public EmailConfirmationException() : base("Email confirmation was failed")
        { }

        public EmailConfirmationException(IEnumerable<string> errors) : this()
        {
            Errors = errors;
        }
    }
}

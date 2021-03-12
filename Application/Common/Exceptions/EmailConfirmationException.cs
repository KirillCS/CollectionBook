using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Application.Common.Exceptions
{
    public class EmailConfirmationException : Exception
    {
        public IDictionary<string, string> Errors { get; set; }

        public EmailConfirmationException() : base("Email confirmation was failed")
        {
            Errors = new Dictionary<string, string>();
        }

        public EmailConfirmationException(IEnumerable<IdentityError> errors) : this()
        {
            Errors = errors.ToDictionary(e => e.Code, e => e.Description);
        }
    }
}

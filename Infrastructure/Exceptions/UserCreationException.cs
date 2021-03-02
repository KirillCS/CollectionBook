using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Infrastructure.Exceptions
{
    public class UserCreationException : Exception
    {
        public IDictionary<string, string> Errors { get; private set; }

        public UserCreationException() : base("User creation was failed")
        {
            Errors = new Dictionary<string, string>(); 
        }

        public UserCreationException(IEnumerable<IdentityError> errors) : base("User creation was failed") 
        {
            Errors = errors.ToDictionary(e => e.Code, e => e.Description);
        }
    }
}

using System;

namespace Application.Common.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class AuthorizeAttribute : Attribute
    {
        public AuthorizeAttribute() : this(Array.Empty<string>())
        {
        }

        public AuthorizeAttribute(string[] roles)
        {
            if (roles is null)
            {
                throw new ArgumentNullException(nameof(roles));
            }

            Roles = roles.Clone() as string[];
        }

        public string[] Roles { get; }
    }
}

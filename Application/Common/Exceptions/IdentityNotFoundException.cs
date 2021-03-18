using System;

namespace Application.Common.Exceptions
{
    public class IdentityNotFoundException : Exception
    {
        public string Id { get; }

        public IdentityNotFoundException() : base("Identity was not found")
        { }

        public IdentityNotFoundException(string id) : base($"Identity with id {id ?? string.Empty} was not found")
        {
            Id = id;
        }
    }
}

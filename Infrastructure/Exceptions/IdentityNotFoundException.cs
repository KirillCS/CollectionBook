using System;

namespace Infrastructure.Exceptions
{
    public class IdentityNotFoundException : Exception
    {
        public string Id { get; }

        public IdentityNotFoundException() : base("Identity was not found")
        { }

        public IdentityNotFoundException(string id) : base($"Identity with id {id} was not found")
        {
            Id = id;
        }
    }
}

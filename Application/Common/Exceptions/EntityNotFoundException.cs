using System;

namespace Application.Common.Exceptions
{
    public class EntityNotFoundException : Exception
    {
        public EntityNotFoundException() : base("Entity was not found")
        { }

        public EntityNotFoundException(string entityType) : 
            base($"Entity \"{entityType}\" with was not found")
        {
            EntityType = entityType;
        }

        public string EntityType { get; }
    }
}

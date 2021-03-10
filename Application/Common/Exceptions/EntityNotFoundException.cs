using System;

namespace Application.Common.Exceptions
{
    public class EntityNotFoundException : Exception
    {
        public EntityNotFoundException() : base("Entity was not found")
        { }

        public EntityNotFoundException(string entityType, string param, string paramValue) : 
            base($"Entity \"{entityType}\" with {param} \"{paramValue ?? string.Empty}\" was not found")
        { }
    }
}

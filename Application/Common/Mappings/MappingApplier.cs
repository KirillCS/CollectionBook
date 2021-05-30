using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Application.Common.Mappings
{
    public static class MappingApplier
    {
        public static void ApplyMappingsFromAssembly(Assembly assembly, Profile profile)
        {
            IEnumerable<Type> types = assembly.GetExportedTypes()
                                              .Where(t => t.GetInterfaces().Any(i => i.IsGenericType && (i.GetGenericTypeDefinition() == typeof(IMapFrom<>) || i.GetGenericTypeDefinition() == typeof(IMapTo<>))));

            foreach (Type type in types)
            {
                object instance = Activator.CreateInstance(type);

                foreach (Type @interface in type.GetInterfaces().Where(i => i.Name == "IMapFrom`1"))
                {
                    @interface.GetMethod("Mapping")?.Invoke(instance, new[] { profile });
                }

                foreach (Type @interface in type.GetInterfaces().Where(i => i.Name == "IMapTo`1"))
                {
                    @interface.GetMethod("Mapping")?.Invoke(instance, new[] { profile });
                }
            }
        }
    }
}

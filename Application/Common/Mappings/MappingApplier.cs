using AutoMapper;
using System;
using System.Linq;
using System.Reflection;

namespace Application.Common.Mappings
{
    public static class MappingApplier
    {
        public static void ApplyMappingsFromAssembly(Assembly assembly, Profile profile)
        {
            var types = assembly.GetExportedTypes()
                                .Where(t => t.GetInterfaces().Any(i => i.IsGenericType && (i.GetGenericTypeDefinition() == typeof(IMapFrom<>) || i.GetGenericTypeDefinition() == typeof(IMapTo<>))))
                                .ToList();

            foreach (var type in types)
            {
                var instance = Activator.CreateInstance(type);
                if (type.GetInterface("IMapFrom`1") is not null)
                {
                    var methodInfo = type.GetMethod("Mapping") ?? type.GetInterface("IMapFrom`1").GetMethod("Mapping");
                    methodInfo?.Invoke(instance, new object[] { profile });
                }

                if (type.GetInterface("IMapTo`1") is not null)
                {
                    var methodInfo = type.GetMethod("Mapping") ?? type.GetInterface("IMapTo`1").GetMethod("Mapping");
                    methodInfo?.Invoke(instance, new object[] { profile });
                }
            }
        }
    }
}

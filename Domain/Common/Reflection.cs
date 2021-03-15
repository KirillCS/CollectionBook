using System;
using System.Linq;
using System.Reflection;

namespace Domain.Common
{
    /// <summary>
    /// A static class for reflection type functions
    /// </summary>
    public static class Reflection
    {
        /// <summary>
        /// Copies values of properties of <paramref name="source"/> to <paramref name="destination"/> propeties.
        /// </summary>
        /// <param name="source">the source</param>
        /// <param name="destination">the destination</param>
        public static void CopyPropertiesTo(this object source, object destination)
        {
            Guard.Requires(() => destination is not null, new ArgumentNullException(nameof(destination)));

            var sourceType = source.GetType();
            var destinationType = destination.GetType();

            var properties = sourceType.GetProperties()
                                       .Join(destinationType.GetProperties(), sp => sp.Name, dp => dp.Name, (sp, dp) => new { SourceProperty = sp, DestinationProperty = dp })
                                       .Where(p => p.SourceProperty.CanRead && CheckDestinationProperty(p.DestinationProperty));

            foreach (var property in properties)
            {
                property.DestinationProperty.SetValue(destination, property.SourceProperty.GetValue(source, null), null);
            }
        }

        private static bool CheckDestinationProperty(PropertyInfo property) =>
            property is not null &&
            property.CanWrite &&
            (property.GetSetMethod(true) is not null && property.GetSetMethod(true).IsPublic) &&
            (property.GetSetMethod().Attributes & MethodAttributes.Static) == 0 &&
            property.PropertyType.IsAssignableFrom(property.PropertyType);
    }
}

using Application.Common.Mappings;
using AutoMapper;
using System.Reflection;

namespace Infrastructure.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            MappingApplier.ApplyMappingsFromAssembly(Assembly.GetExecutingAssembly(), this);
        }
    }
}

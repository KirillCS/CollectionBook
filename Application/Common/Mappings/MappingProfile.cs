﻿using AutoMapper;
using System.Reflection;

namespace Application.Common.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            MappingApplier.ApplyMappingsFromAssembly(Assembly.GetExecutingAssembly(), this);
        }
    }
}

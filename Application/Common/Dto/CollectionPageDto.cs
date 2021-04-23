using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class CollectionPageDto : IMapFrom<Collection>
    {
        public CollectionDto Collection { get; set; }

        void IMapFrom<Collection>.Mapping(Profile profile)
        {
            profile.CreateMap<Collection, CollectionPageDto>()
                   .ForMember(dto => dto.Collection, s => s.MapFrom(c => c));
        }
    }
}

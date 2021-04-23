using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class FullCollectionDto : IMapFrom<Collection>
    {
        public CollectionDto Collection { get; set; }

        void IMapFrom<Collection>.Mapping(Profile profile)
        {
            profile.CreateMap<Collection, FullCollectionDto>()
                   .ForMember(dto => dto.Collection, s => s.MapFrom(c => c));
        }
    }
}

using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class TopTagDto : IMapFrom<Tag>
    {
        public string Label { get; set; }

        public int Count { get; set; }

        void IMapFrom<Tag>.Mapping(Profile profile) =>
            profile.CreateMap<Tag, TopTagDto>()
                   .ForMember(d => d.Count, s => s.MapFrom(t => t.Collections.Count));
    }
}

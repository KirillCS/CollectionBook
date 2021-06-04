using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Responses
{
    public class TopTagsResponse : IMapFrom<Tag>
    {
        public string Label { get; set; }

        public int Count { get; set; }

        void IMapFrom<Tag>.Mapping(Profile profile) =>
            profile.CreateMap<Tag, TopTagsResponse>()
                   .ForMember(d => d.Count, s => s.MapFrom(t => t.Collections.Count));
    }
}

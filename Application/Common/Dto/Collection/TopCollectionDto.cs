using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class TopCollectionDto : IMapFrom<Collection>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string UserLogin { get; set; }

        public int StarsCount { get; set; }

        void IMapFrom<Collection>.Mapping(Profile profile) =>
            profile.CreateMap<Collection, TopCollectionDto>()
                   .ForMember(d => d.UserLogin, s => s.MapFrom(c => c.User.UserName));
    }
}

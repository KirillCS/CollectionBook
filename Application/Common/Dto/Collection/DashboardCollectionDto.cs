using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class DashboardCollectionDto : IMapFrom<Collection>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string UserLogin { get; set; }

        void IMapFrom<Collection>.Mapping(Profile profile) =>
            profile.CreateMap<Collection, DashboardCollectionDto>()
                   .ForMember(d => d.UserLogin, s => s.MapFrom(c => c.User.UserName));
    }
}

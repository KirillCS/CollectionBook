using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class DashboardUserDto : IMapFrom<User>
    {
        public string Id { get; set; }

        public string Login { get; set; }

        public bool IsBlocked { get; set; }

        public string Role { get; set; }

        void IMapFrom<User>.Mapping(Profile profile)
        {
            profile.CreateMap<User, DashboardUserDto>()
                   .ForMember(d => d.Login, s => s.MapFrom(u => u.UserName))
                   .ForMember(d => d.IsBlocked, s => s.MapFrom(u => u.LockoutEnabled))
                   .ForMember(d => d.Role, s => s.MapFrom(u => "OK"));
        }
    }
}

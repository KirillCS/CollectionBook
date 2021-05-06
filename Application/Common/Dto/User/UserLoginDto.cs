using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class UserLoginDto : IMapFrom<User>
    {
        public string Id { get; set; }

        public string Login { get; set; }

        void IMapFrom<User>.Mapping(Profile profile)
        {
            profile.CreateMap<User, UserLoginDto>().ForMember(d => d.Login, s => s.MapFrom(u => u.UserName));
        }
    }
}

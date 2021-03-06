using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Auth.Commands.Login
{
    public class LoginUserDto : IMapFrom<User>
    {
        public string Id { get; set; }

        public string Login { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<User, LoginUserDto>()
                   .ForMember(lu => lu.Login, opt => opt.MapFrom(u => u.UserName));
        }
    }
}

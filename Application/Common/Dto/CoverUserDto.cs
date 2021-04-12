using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class CoverUserDto : IMapFrom<User>
    {
        public string Login { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string AvatarPath { get; set; }

        void IMapFrom<User>.Mapping(Profile profile)
        {
            profile.CreateMap<User, CoverUserDto>().ForMember(d => d.Login, s => s.MapFrom(u => u.UserName));
        }
    }
}

using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class UserCoverDto : IMapFrom<User>
    {
        public string Id { get; set; }

        public string Login { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string AvatarPath { get; set; }

        void IMapFrom<User>.Mapping(Profile profile)
        {
            profile.CreateMap<User, UserCoverDto>().ForMember(d => d.Login, s => s.MapFrom(u => u.UserName));
        }
    }
}

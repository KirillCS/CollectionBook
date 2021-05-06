using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class UserDto : IMapFrom<User>
    {
        public string Id { get; set; }

        public string Login { get; set; }

        public string Email { get; set; }

        public bool IsEmailVisible { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string AvatarPath { get; set; }

        public string Location { get; set; }

        public string Biography { get; set; }

        public string WebsiteUrl { get; set; }

        public string TelegramLogin { get; set; }

        public string InstagramLogin { get; set; }

        void IMapFrom<User>.Mapping(Profile profile)
        {
            profile.CreateMap<User, UserDto>().ForMember(d => d.Login, s => s.MapFrom(u => u.UserName));
        }
    }
}

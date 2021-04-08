using Application.Common.Mappings;
using Application.Common.Models;
using AutoMapper;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace Infrastructure.Identity
{
    public class User : IdentityUser, IMapTo<UserDto>, IMapFrom<UserDto>
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Location { get; set; }

        public string Biography { get; set; }

        public string WebsiteUrl { get; set; }

        public string TelegramLogin { get; set; }

        public string InstagramLogin { get; set; }

        public bool IsEmailVisible { get; set; }

        public string AvatarPath { get; set; }

        public List<Collection> Collections { get; } = new List<Collection>();

        public List<Star> Stars { get; } = new List<Star>();

        public User() : base()
        { }

        public User(string userName) : base(userName)
        { }

        void IMapTo<UserDto>.Mapping(Profile profile)
        {
            profile.CreateMap<User, UserDto>().ForMember(d => d.Login, s => s.MapFrom(u => u.UserName));
        }

        void IMapFrom<UserDto>.Mapping(Profile profile)
        {
            profile.CreateMap<UserDto, User>().ForMember(d => d.UserName, s => s.MapFrom(u => u.Login));
        }
    }
}

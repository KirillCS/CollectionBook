﻿using Application.Common.Mappings;
using Application.Common.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class User : IdentityUser, IMapTo<UserDto>
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

        public User()
        { }

        public User(string userName) : base(userName)
        { }

        void IMapTo<UserDto>.Mapping(Profile profile)
        {
            profile.CreateMap<User, UserDto>().ForMember(d => d.Login, s => s.MapFrom(u => u.UserName));
        }
    }
}
﻿using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Location { get; set; }

        public string Biography { get; set; }

        public string TelegramLogin { get; set; }

        public string InstagramLogin { get; set; }

        public bool IsEmailVisible { get; set; }

        public User()
        { }

        public User(string userName) : base(userName)
        { }
    }
}

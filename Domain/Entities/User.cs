using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class User : IdentityUser
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

        public bool IsBlocked { get; set; }

        public string BlockReason { get; set; }

        public int RoleId { get; set; }

        public Role Role { get; set; }

        public List<Collection> Collections { get; } = new List<Collection>();

        public List<Star> Stars { get; } = new List<Star>();

        public User() : base()
        { }

        public User(string userName) : base(userName)
        { }
    }
}

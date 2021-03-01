using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public class User : IdentityUser
    {
        public User()
        { }

        public User(string userName) : base(userName)
        { }
    }
}

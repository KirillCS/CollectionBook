using Application.Common.Mappings;
using Application.Common.Models;

namespace Application.Auth.Commands.Register
{
    public class RegisterResponse : IMapFrom<UserDto>
    {
        public string Id { get; set; }

        public string Email { get; set; }
    }
}

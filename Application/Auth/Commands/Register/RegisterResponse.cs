using Application.Common.Mappings;
using Domain.Entities;

namespace Application.Auth.Commands.Register
{
    public class RegisterResponse : IMapFrom<User>
    {
        public string Id { get; set; }

        public string Email { get; set; }
    }
}

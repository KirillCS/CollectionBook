using Application.Common.Mappings;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class RegisterDto : IMapFrom<User>
    {
        public string Id { get; set; }

        public string Email { get; set; }
    }
}

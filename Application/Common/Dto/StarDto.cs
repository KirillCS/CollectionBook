using Application.Common.Mappings;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class StarDto : IMapFrom<Star>
    {
        public string UserId { get; set; }
    }
}

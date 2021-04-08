using Application.Common.Mappings;
using Domain.Entities;

namespace Application.Common.Models
{
    public class StarDto : IMapFrom<Star>
    {
        public string UserId { get; set; }
    }
}

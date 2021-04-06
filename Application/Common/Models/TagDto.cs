using Application.Common.Mappings;
using Domain.Entities;

namespace Application.Common.Models
{
    public class TagDto : IMapFrom<Tag>
    {
        public int Id { get; set; }

        public string Label { get; set; }
    }
}

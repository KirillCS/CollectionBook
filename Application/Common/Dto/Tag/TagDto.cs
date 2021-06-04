using Application.Common.Mappings;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class TagDto : IMapFrom<Tag>
    {
        public string Label { get; set; }
    }
}

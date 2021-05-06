using Application.Common.Mappings;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class ImageDto : IMapFrom<ItemImage>
    {
        public int Id { get; set; }

        public string Path { get; set; }
    }
}

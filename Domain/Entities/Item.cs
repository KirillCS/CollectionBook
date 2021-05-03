using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class Item
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Information { get; set; }

        public DateTime CreationTime { get; set; }

        public int CollectionId { get; set; }

        public Collection Collection { get; set; }

        public List<ItemImage> Images { get; } = new List<ItemImage>();

        public List<Tag> Tags { get; } = new List<Tag>();
    }
}

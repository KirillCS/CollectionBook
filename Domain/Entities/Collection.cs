using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class Collection
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string CoverPath { get; set; }

        public DateTime CreationTime { get; set; }

        public string UserId { get; set; }

        public User User { get; set; }

        public List<Tag> Tags { get; } = new List<Tag>();

        public List<Star> Stars { get; } = new List<Star>();

        public List<Item> Items { get; } = new List<Item>();
    }
}

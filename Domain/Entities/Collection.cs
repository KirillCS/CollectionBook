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

        public List<Tag> Tags { get; private set; } = new List<Tag>();
    }
}

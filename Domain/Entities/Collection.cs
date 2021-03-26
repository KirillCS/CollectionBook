using System;

namespace Domain.Entities
{
    public class Collection
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string CoverPath { get; set; }

        public DateTime CreationTime { get; set; }

        public string UserId { get; set; }
    }
}

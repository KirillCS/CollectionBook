using System;

namespace Domain.Entities
{
    public class Report
    {
        public int Id { get; set; }

        public string Description { get; set; }

        public DateTime CreationTime { get; set; }

        public int CollectionId { get; set; }

        public Collection Collection { get; set; }

        public string UserId { get; set; }

        public User User { get; set; }
    }
}

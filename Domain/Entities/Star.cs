using System.Collections.Generic;

namespace Domain.Entities
{
    public class Star
    {
        public int Id { get; set; }

        public List<Collection> Collections { get; } = new List<Collection>();
    }
}

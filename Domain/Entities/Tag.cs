using System.Collections.Generic;

namespace Domain.Entities
{
    public class Tag
    {
        public int Id { get; set; }

        public string Label { get; set; }

        public IList<Collection> Collections { get; private set; } = new List<Collection>();
    }
}

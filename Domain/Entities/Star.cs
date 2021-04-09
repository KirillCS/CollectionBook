namespace Domain.Entities
{
    public class Star
    {
        public long Id { get; set; }

        public int CollectionId { get; set; }

        public string UserId { get; set; }

        public Collection Collection { get; set; }
    }
}

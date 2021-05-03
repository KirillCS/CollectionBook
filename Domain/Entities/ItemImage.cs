namespace Domain.Entities
{
    public class ItemImage
    {
        public int Id { get; set; }

        public string Path { get; set; }

        public int ItemId { get; set; }

        public Item Item { get; set; }
    }
}

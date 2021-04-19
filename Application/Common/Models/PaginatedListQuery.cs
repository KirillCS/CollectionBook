namespace Application.Common.Models
{
    public class PaginatedListQuery
    {
        private int pageIndex;
        private int pageSize;

        public int PageIndex
        {
            get => pageIndex;
            set => pageIndex = value < 0 ? 0 : value;
        }

        public int PageSize
        {
            get => pageSize;
            set => pageSize = value < 0 ? 0 : value;
        }
    }
}

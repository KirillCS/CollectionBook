namespace Application.Common.Models
{
    public class PaginatedListQuery
    {
        private int pageIndex;
        private int pageSize;
        private string searchString = string.Empty;

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

        public string SearchString
        {
            get => searchString;
            set => searchString = value ?? string.Empty;
        }
    }
}

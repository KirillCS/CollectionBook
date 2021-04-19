namespace Application.Common.Models
{
    public class SearchPaginatedListQuery : PaginatedListQuery
    {
        private string searchString = string.Empty;

        public string SearchString
        {
            get => searchString;
            set => searchString = value ?? string.Empty;
        }
    }
}

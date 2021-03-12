namespace Infrastructure.Models
{
    public class SpaOptions
    {
        public string BaseUrl { get; set; }

        public string EmailConfirmedUrl { get; set; }

        public string FullEmailConfirmedUrl => BaseUrl + EmailConfirmedUrl;
    }
}

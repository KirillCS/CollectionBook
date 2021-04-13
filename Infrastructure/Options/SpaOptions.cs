namespace Infrastructure.Options
{
    public class SpaOptions
    {
        public string BaseUrl { get; set; }

        public string EmailConfirmedUrl { get; set; }

        public string EmailUpdatedUrl { get; set; }

        public string PasswordResetUrl { get; set; }

        public string FullEmailConfirmedUrl => BaseUrl + EmailConfirmedUrl;

        public string FullEmailUpdatedUrl => BaseUrl + EmailUpdatedUrl;

        public string FullPasswordResetUrl => BaseUrl + PasswordResetUrl;
    }
}

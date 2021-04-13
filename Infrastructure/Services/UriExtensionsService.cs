using Application.Common.Interfaces;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using System.Collections.Generic;

namespace Infrastructure.Services
{
    public class UriExtensionsService : IUriExtensionsService
    {
        private readonly SpaOptions spaOptions;
        private readonly IUriService uriService;

        public UriExtensionsService(IOptions<SpaOptions> spaOptions, IUriService uriService)
        {
            this.spaOptions = spaOptions.Value;
            this.uriService = uriService;
        }

        public string GenerateEmailConfirmationUri(string userId, string token)
        {
            var queryParams = new Dictionary<string, string>
            {
                { "id", userId },
                { "token", token }
            };

            return uriService.GenerateUri(spaOptions.FullEmailConfirmedUrl, queryParams);
        }

        public string GenerateEmailUpdateConfirmationUri(string userId, string newEmail, string token)
        {
            var queryParams = new Dictionary<string, string>
            {
                { "id", userId },
                { "email", newEmail },
                { "token", token }
            };

            return uriService.GenerateUri(spaOptions.FullEmailUpdatedUrl, queryParams);
        }

        public string GeneratePasswordResetUri(string userId, string token)
        {
            var queryParams = new Dictionary<string, string>
            {
                { "id", userId },
                { "token", token }
            };

            return uriService.GenerateUri(spaOptions.FullPasswordResetUrl, queryParams);
        }
    }
}

using Application.Common.Interfaces;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Web;

namespace Infrastructure.Services
{
    public class UriService : IUriService
    {
        private readonly SpaOptions spaOptions;

        public UriService(IOptions<SpaOptions> spaOptions)
        {
            this.spaOptions = spaOptions.Value;
        }

        public string GenerateEmailConfirmationUri(string userId, string token)
        {
            var queryParams = new Dictionary<string, string>
            {
                { "id", userId },
                { "token", token }
            };

            return GenerateUri(spaOptions.FullEmailConfirmedUrl, queryParams);
        }

        public string GenerateEmailChangingUri(string userId, string newEmail, string token)
        {
            var queryParams = new Dictionary<string, string>
            {
                { "id", userId },
                { "email", newEmail },
                { "token", token }
            };

            return GenerateUri(spaOptions.FullEmailChangedUrl, queryParams);
        }

        public string GeneratePasswordResetUri(string userId, string token)
        {
            var queryParams = new Dictionary<string, string>
            {
                { "id", userId },
                { "token", token }
            };

            return GenerateUri(spaOptions.FullPasswordResetUrl, queryParams);
        }

        public string GenerateUri(string baseUrl, IDictionary<string, string> queryParams)
        {
            var uriBuilder = new UriBuilder(baseUrl);
            var query = HttpUtility.ParseQueryString(uriBuilder.Query);
            foreach (var key in queryParams.Keys)
            {
                query[key] = queryParams[key];
            }

            uriBuilder.Query = query.ToString();
            return uriBuilder.ToString();
        }
    }
}

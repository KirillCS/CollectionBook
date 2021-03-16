using Application.Common.Interfaces;
using Domain.Common;
using Infrastructure.Models;
using Microsoft.Extensions.Options;
using System;
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
            var uriBuilder = new UriBuilder(spaOptions.FullEmailConfirmedUrl);
            var query = HttpUtility.ParseQueryString(uriBuilder.Query);
            query["id"] = userId;
            query["token"] = token;
            uriBuilder.Query = query.ToString();
            return uriBuilder.ToString();
        }

        public string GenerateEmailChangingUri(string userId, string newEmail, string token)
        {
            var uriBuilder = new UriBuilder(spaOptions.FullEmailChangedUrl);
            var query = HttpUtility.ParseQueryString(uriBuilder.Query);
            query["id"] = userId;
            query["email"] = newEmail;
            query["token"] = token;
            uriBuilder.Query = query.ToString();
            return uriBuilder.ToString();
        }
    }
}

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

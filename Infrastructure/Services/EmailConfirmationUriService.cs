using Application.Common.Interfaces;
using Domain.Entities;
using Infrastructure.Models;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;
using System.Web;

namespace Infrastructure.Services
{
    public class EmailConfirmationUriService : IEmailConfirmationUriService
    {
        private readonly IUserService userService;
        private readonly SpaOptions spaOptions;

        public EmailConfirmationUriService(IUserService userService, IOptions<SpaOptions> spaOptions)
        {
            this.userService = userService;
            this.spaOptions = spaOptions.Value;
        }

        public async Task<string> Generate(User user)
        {
            var emailConfirmationToken = await userService.GenerateEmailConfirmationToken(user);
            var uriBuilder = new UriBuilder(spaOptions.BaseUrl);
            var query = HttpUtility.ParseQueryString(uriBuilder.Query);
            query["token"] = emailConfirmationToken;
            query["id"] = user.Id;
            uriBuilder.Query = query.ToString();
            return uriBuilder.ToString();
        }
    }
}

using Application.Common.Interfaces;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class EmailChangingTokenSenderService : IEmailChangingTokenSenderService
    {
        private readonly IUriService uriService;
        private readonly IEmailSenderService emailSender;

        public EmailChangingTokenSenderService(IUriService uriService, IEmailSenderService emailSender)
        {
            this.uriService = uriService;
            this.emailSender = emailSender;
        }

        public async Task Send(string userId, string newEmail, string token)
        {
            var uri = uriService.GenerateEmailChangingUri(userId, newEmail, token);
            await emailSender.SendEmail(newEmail, "Changing account email", $"<h2>CollectionBook</h2><p>To complete email changing you need to <a href=\"{uri}\"><b>click here</b></a>.</p>");
        }
    }
}

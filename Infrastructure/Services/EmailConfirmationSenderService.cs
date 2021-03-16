using Application.Common.Interfaces;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class EmailConfirmationSenderService : IEmailConfirmationSenderService
    {
        private readonly IUriService uriService;
        private readonly IEmailSenderService emailSender;

        public EmailConfirmationSenderService(IUriService uriService, IEmailSenderService emailSender)
        {
            this.uriService = uriService;
            this.emailSender = emailSender;
        }

        public async Task Send(string userId, string email, string token)
        {
            var uri = uriService.GenerateEmailConfirmationUri(userId, token);
            await emailSender.SendEmail(email, "Email confirmation", $"<h2>CollectionBook</h2><p>To complete your profile and start using \"CollectionBook\" you'll need to verify your email address. <a href=\"{uri}\"><b>Click here!</b></a></p>");
        }
    }
}

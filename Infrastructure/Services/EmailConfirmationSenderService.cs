using Application.Common.Interfaces;
using Domain.Entities;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class EmailConfirmationSenderService : IEmailConfirmationSenderService
    {
        private readonly IEmailConfirmationUriService uriService;
        private readonly IEmailSenderService emailSender;

        public EmailConfirmationSenderService(IEmailConfirmationUriService uriService, IEmailSenderService emailSender)
        {
            this.uriService = uriService;
            this.emailSender = emailSender;
        }

        public async Task SendConfirmation(User user)
        {
            var uri = await uriService.Generate(user);
            await emailSender.SendEmail(user.Email, "Email confirmation", $"<h2>CollectionBook</h2><p>To complete your profile and start using \"CollectionBook\" you'll need to verify your email address. <a href=\"{uri}\"><b>Click here!</b></a></p>");
        }
    }
}

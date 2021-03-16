using Application.Common.Interfaces;
using Infrastructure.Models;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class EmailSenderService : IEmailSenderService
    {
        private readonly SmtpOptions smtpOptions;
        private readonly IEmailMessageService messageService;

        public EmailSenderService(IOptions<SmtpOptions> smtpOptions, IEmailMessageService messageService)
        {
            this.smtpOptions = smtpOptions.Value;
            this.messageService = messageService;
        }

        public async Task SendEmail(string email, string subject, string message)
        {
            var mimeMessage = messageService.GenerateMessage(email, subject, message);

            using var client = new SmtpClient();

            client.AuthenticationMechanisms.Remove("XOAUTH2");
            await client.ConnectAsync(smtpOptions.Host, smtpOptions.Port, false);
            await client.AuthenticateAsync(smtpOptions.Username, smtpOptions.Password);

            await client.SendAsync(mimeMessage);
            await client.DisconnectAsync(true);
        }
    }
}

using Application.Common.Interfaces;
using Infrastructure.Options;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class EmailSenderService : IEmailSenderService
    {
        private readonly SmtpOptions smtpOptions;

        public EmailSenderService(IOptions<SmtpOptions> smtpOptions)
        {
            this.smtpOptions = smtpOptions.Value;
        }

        public async Task SendEmail(MimeMessage message)
        {
            using var client = new SmtpClient();

            client.AuthenticationMechanisms.Remove("XOAUTH2");
            await client.ConnectAsync(smtpOptions.Host, smtpOptions.Port, false);
            await client.AuthenticateAsync(smtpOptions.Username, smtpOptions.Password);

            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}

﻿using Application.Common.Interfaces;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Infrastructure.Services
{
    public class EmailMessageService : IEmailMessageService
    {
        private readonly EmailOptions emailOptions;

        public EmailMessageService(IOptions<EmailOptions> emailOptions)
        {
            this.emailOptions = emailOptions.Value;
        }

        public MimeMessage GenerateMessage(string recipientEmail, string subject, string message)
        {
            var mimeMessage = new MimeMessage();
            mimeMessage.From.Add(new MailboxAddress(emailOptions.Name, emailOptions.Address));
            mimeMessage.To.Add(MailboxAddress.Parse(recipientEmail));
            mimeMessage.Subject = subject;
            var body = new BodyBuilder { HtmlBody = message };
            mimeMessage.Body = body.ToMessageBody();

            return mimeMessage;
        }
    }
}

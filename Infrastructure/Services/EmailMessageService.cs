﻿using Application.Common.Interfaces;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Infrastructure.Services
{
    public class EmailMessageService : IEmailMessageService
    {
        private readonly EmailOptions emailOptions;
        private readonly IUriService uriService;

        public EmailMessageService(IOptions<EmailOptions> emailOptions, IUriService uriService)
        {
            this.emailOptions = emailOptions.Value;
            this.uriService = uriService;
        }

        public MimeMessage GenerateEmailConfirmationMessage(string recipientEmail, string userId, string confirmationToken)
        {
            var subject = emailOptions.ConfirmationSubject;
            var uri = uriService.GenerateEmailConfirmationUri(userId, confirmationToken);
            var message = string.Format(emailOptions.ConfirmationMessage, uri);

            return GenerateCustomMessage(recipientEmail, subject, message);
        }

        public MimeMessage GenerateEmailChangingMessage(string recipientEmail, string userId, string changingToken)
        {
            var subject = emailOptions.ChangingSubject;
            var uri = uriService.GenerateEmailChangingUri(userId, recipientEmail, changingToken);
            var message = string.Format(emailOptions.ChangingMessage, uri);

            return GenerateCustomMessage(recipientEmail, subject, message);
        }

        public MimeMessage GeneratePasswordResetMessage(string recipientEmail, string userId, string passwordResetToken)
        {
            var subject = emailOptions.PasswordResetSubject;
            var uri = uriService.GeneratePasswordResetUri(userId, passwordResetToken);
            var message = string.Format(emailOptions.PasswordResetMessage, uri);

            return GenerateCustomMessage(recipientEmail, subject, message);
        }

        public MimeMessage GenerateCustomMessage(string recipientEmail, string subject, string message)
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

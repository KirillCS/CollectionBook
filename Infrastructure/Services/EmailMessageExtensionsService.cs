using Application.Common.Interfaces;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Infrastructure.Services
{
    public class EmailMessageExtensionsService : IEmailMessageExtensionsService
    {
        private readonly EmailOptions emailOptions;
        private readonly IUriExtensionsService uriService;
        private readonly IEmailMessageService emailMessageService;

        public EmailMessageExtensionsService(IOptions<EmailOptions> emailOptions, IUriExtensionsService uriService, IEmailMessageService emailMessageService)
        {
            this.emailOptions = emailOptions.Value;
            this.uriService = uriService;
            this.emailMessageService = emailMessageService;
        }

        public MimeMessage GenerateEmailUpdateConfirmationMessage(string recipientEmail, string userId, string changingToken)
        {
            string subject = emailOptions.EmailUpdateConfirmationSubject;
            string uri = uriService.GenerateEmailUpdateConfirmationUri(userId, recipientEmail, changingToken);
            string message = string.Format(emailOptions.EmailUpdateConfirmationMessage, uri);

            return emailMessageService.GenerateMessage(recipientEmail, subject, message);
        }

        public MimeMessage GenerateEmailConfirmationMessage(string recipientEmail, string userId, string confirmationToken)
        {
            string subject = emailOptions.EmailConfirmationSubject;
            string uri = uriService.GenerateEmailConfirmationUri(userId, confirmationToken);
            string message = string.Format(emailOptions.EmailConfirmationMessage, uri);

            return emailMessageService.GenerateMessage(recipientEmail, subject, message);
        }

        public MimeMessage GeneratePasswordResetMessage(string recipientEmail, string userId, string passwordResetToken)
        {
            string subject = emailOptions.PasswordResetSubject;
            string uri = uriService.GeneratePasswordResetUri(userId, passwordResetToken);
            string message = string.Format(emailOptions.PasswordResetMessage, uri);

            return emailMessageService.GenerateMessage(recipientEmail, subject, message);
        }

        public MimeMessage GenerateCollectionDeletionMessage(string recipientEmail, string collectionName, string reason)
        {
            string subject = emailOptions.CollectionDeletionSubject;
            string message = string.Format(emailOptions.CollectionDeletionMessage, collectionName, reason);

            return emailMessageService.GenerateMessage(recipientEmail, subject, message);
        }
    }
}

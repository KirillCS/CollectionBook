using MimeKit;

namespace Application.Common.Interfaces
{
    public interface IEmailMessageService
    {
        MimeMessage GenerateEmailConfirmationMessage(string recipientEmail, string userId, string confirmationToken);

        MimeMessage GenerateEmailChangingMessage(string recipientEmail, string userId, string changingToken);

        MimeMessage GenerateCustomMessage(string recipientEmail, string subject, string message);
    }
}

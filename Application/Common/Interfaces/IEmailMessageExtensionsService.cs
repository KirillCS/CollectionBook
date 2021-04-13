using MimeKit;

namespace Application.Common.Interfaces
{
    public interface IEmailMessageExtensionsService
    {
        MimeMessage GenerateEmailConfirmationMessage(string recipientEmail, string userId, string confirmationToken);

        MimeMessage GenerateEmailUpdateConfirmationMessage(string recipientEmail, string userId, string changingToken);

        MimeMessage GeneratePasswordResetMessage(string recipientEmail, string userId, string passwordResetToken);
    }
}

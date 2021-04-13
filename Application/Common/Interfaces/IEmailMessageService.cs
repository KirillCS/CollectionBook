using MimeKit;

namespace Application.Common.Interfaces
{
    public interface IEmailMessageService
    {
        MimeMessage GenerateMessage(string recipientEmail, string subject, string message);
    }
}

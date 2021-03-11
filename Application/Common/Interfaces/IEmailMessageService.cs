using MimeKit;

namespace Application.Common.Interfaces
{
    public interface IEmailMessageService
    {
        MimeMessage GenerateMessage(string email, string subject, string message);
    }
}

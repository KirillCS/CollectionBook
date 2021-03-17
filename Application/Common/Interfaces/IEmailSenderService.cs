using MimeKit;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IEmailSenderService
    {
        Task SendEmail(MimeMessage message);
    }
}

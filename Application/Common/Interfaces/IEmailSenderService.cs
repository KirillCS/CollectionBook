using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IEmailSenderService
    {
        Task SendEmail(string email, string subject, string message);
    }
}

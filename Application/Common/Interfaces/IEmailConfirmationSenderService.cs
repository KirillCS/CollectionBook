using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IEmailConfirmationSenderService
    {
        Task Send(string userId, string email, string token);
    }
}

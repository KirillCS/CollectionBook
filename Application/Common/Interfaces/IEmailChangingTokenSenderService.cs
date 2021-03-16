using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IEmailChangingTokenSenderService
    {
        Task Send(string userId, string newEmail, string token);
    }
}

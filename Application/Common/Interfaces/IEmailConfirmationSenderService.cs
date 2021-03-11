using Domain.Entities;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IEmailConfirmationSenderService
    {
        Task SendConfirmation(User user);
    }
}

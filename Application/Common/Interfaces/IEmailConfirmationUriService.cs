using Domain.Entities;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IEmailConfirmationUriService
    {
        Task<string> Generate(User user);
    }
}

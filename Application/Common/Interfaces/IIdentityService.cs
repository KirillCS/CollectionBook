using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IIdentityService
    {
        Task<bool> LoginExists(string login);

        Task<bool> EmailExists(string email);

        Task SetLogin(string userId, string newLogin);

        Task SetEmail(string userId, string newEmail);

        Task<string> GenerateEmailConfirmationToken(string userId);

        Task<bool> IsEmailConfirmed(string userId);

        Task ConfirmEmail(string userId, string confirmationToken);

        Task<string> GenerateEmailChangingToken(string userId, string newEmail);

        Task ChangeEmail(string userId, string newEmail, string emailChangingToken);

        Task<IEnumerable<string>> GetUserRoles(string userId);

        Task<IEnumerable<Claim>> GetUserClaims(string userId);

        Task Authorize(string login, string password);
    }
}

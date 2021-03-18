using Application.Common.Models;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IIdentityService
    {
        Task<bool> LoginExists(string login);

        Task<bool> EmailExists(string email);

        Task<Result> SetLogin(string userId, string newLogin);

        Task<Result> SetEmail(string userId, string newEmail);

        Task<string> GenerateEmailConfirmationToken(string userId);

        Task<bool> IsEmailConfirmed(string userId);

        Task<Result> ConfirmEmail(string userId, string confirmationToken);

        Task<string> GenerateEmailChangingToken(string userId, string newEmail);

        Task<Result> ChangeEmail(string userId, string newEmail, string emailChangingToken);

        Task<IEnumerable<string>> GetUserRoles(string userId);

        Task<IEnumerable<Claim>> GetUserClaims(string userId);

        Task<string> Create(string userName, string email, string password);

        Task<bool> Authorize(string login, string password);
    }
}

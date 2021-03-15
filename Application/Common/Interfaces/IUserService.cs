using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IUserService
    {
        Task<bool> UserNameExists(string userName);

        Task<bool> EmailExists(string email);

        Task<User> GetUserById(string id);

        Task<User> GetUserByUserName(string userName);

        Task<User> GetUserByEmail(string email);

        Task<IList<string>> GetUserRoles(User user);

        Task<string> GenerateEmailConfirmationToken(User user);

        Task<bool> IsEmailConfirmed(User user);

        Task SetEmail(User user, string email);

        Task<IdentityResult> ConfirmEmail(User user, string token);

        Task<User> CreateUser(string userName, string email, string password);

        Task<IdentityResult> UpdateUser(User user);

        Task<User> Authorize(string userName, string password);
    }
}

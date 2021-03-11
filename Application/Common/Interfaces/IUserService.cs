using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IUserService
    {
        Task<bool> UserNameExists(string userName);

        Task<bool> EmailExists(string email);

        Task<User> GetUserByUserName(string userName);

        Task<User> GetUserByEmail(string email);

        Task<IList<string>> GetUserRoles(User user);

        Task<string> GenerateEmailConfirmationToken(User user);

        Task<User> CreateUser(string userName, string email, string password);

        Task<User> Authorize(string userName, string password);
    }
}

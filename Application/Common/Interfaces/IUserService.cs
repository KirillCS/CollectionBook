using Domain.Entities;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IUserService
    {
        Task<User> Create(string login, string email, string password);

        Task<User> Authorize(string loginCredential, string password);

        Task<IEnumerable<Claim>> GetLoginClaims(User user);

        Task<bool> CheckPassword(string userId, string currentPassword);

        Task<bool> LoginExists(string login);

        Task<bool> EmailExists(string email);
    }
}

using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IUserService
    {
        Task<bool> UserNameExists(string userName);

        Task<User> GetUser(string userName);

        Task<IList<string>> GetUserRoles(User user);

        Task<User> CreateUser(string userName, string password);

        Task<User> Authorize(string userName, string password);
    }
}

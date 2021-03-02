using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IUserService
    {
        Task<IList<string>> GetUserRoles(User user);

        Task<User> CreateUser(string userName, string password);

        Task<User> Authorize(string userName, string password);
    }
}

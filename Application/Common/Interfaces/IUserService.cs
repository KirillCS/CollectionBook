using Application.Common.Models;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IUserService
    {
        Task<UserDto> GetById(string id);

        Task<UserDto> GetByLogin(string login);
    }
}

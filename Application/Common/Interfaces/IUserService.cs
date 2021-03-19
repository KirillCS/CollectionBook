using Application.Common.Models;
using Application.Users.Commands.UpdateProfile;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IUserService
    {
        Task<UserDto> GetById(string id);

        Task<UserDto> GetByLogin(string login);

        Task<Result> UpdateProfile(string userId, UpdateProfileCommand command);
    }
}

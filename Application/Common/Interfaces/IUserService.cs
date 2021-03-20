using Application.Common.Models;
using Application.Users.Commands.UpdateProfile;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IUserService
    {
        Task<UserDto> GetById(string id);

        Task<UserDto> GetByLogin(string login);

        Task<UserDto> GetByEmail(string email);

        Task<Result> UpdateProfile(string userId, UpdateProfileCommand command);
    }
}

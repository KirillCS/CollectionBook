using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> userManager;
        private readonly IMapper mapper;

        public UserService(UserManager<User> userManager, IMapper mapper)
        {
            this.userManager = userManager;
            this.mapper = mapper;
        }

        public async Task<UserDto> GetById(string id)
        {
            var user = await userManager.FindByIdAsync(id);

            return mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> GetByLogin(string login)
        {
            var user = await userManager.FindByNameAsync(login);

            return mapper.Map<UserDto>(user);
        }
    }
}

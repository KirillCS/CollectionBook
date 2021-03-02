using FluentValidation.Results;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using Infrastructure.Exceptions;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValidationException = Application.Common.Exceptions.ValidationException;

namespace Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> userManager;

        public UserService(UserManager<User> userManager)
        {
            this.userManager = userManager;
        }

        public async Task<bool> UserNameExists(string userName)
        {
            return await GetUser(userName) is not null;
        }

        public async Task<User> GetUser(string userName)
        {
            return await userManager.FindByNameAsync(userName);
        }

        public async Task<IList<string>> GetUserRoles(User user)
        {
            return await userManager.GetRolesAsync(user);
        }

        public async Task<User> CreateUser(string userName, string password)
        {
            var user = new User(userName);
            var result = await userManager.CreateAsync(user, password);
            Guard.Requires(() => result.Succeeded, new ValidationException(result.Errors.Select(e => new ValidationFailure("Password", e.Description))));

            return user;
        }

        public async Task<User> Authorize(string userName, string password)
        {
            var user = await userManager.FindByNameAsync(userName);
            Guard.Requires(() => user != null, new InvalidLoginCredentialsException(userName));
            await Guard.RequiresAsync(async () => await userManager.CheckPasswordAsync(user, password), new InvalidLoginCredentialsException(userName));

            return user;
        }
    }
}

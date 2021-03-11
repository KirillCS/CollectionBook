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
            return await GetUserByUserName(userName) is not null;
        }

        public async Task<bool> EmailExists(string email)
        {
            return await GetUserByEmail(email) is not null;
        }

        public async Task<User> GetUserByUserName(string userName)
        {
            return userName is null ? null : await userManager.FindByNameAsync(userName);
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return email is null ? null : await userManager.FindByEmailAsync(email);
        }

        public async Task<IList<string>> GetUserRoles(User user)
        {
            return await userManager.GetRolesAsync(user);
        }

        public async Task<User> CreateUser(string userName, string email, string password)
        {
            var user = new User(userName) { Email = email };
            var result = await userManager.CreateAsync(user, password);
            Guard.Requires(() => result.Succeeded, new ValidationException(result.Errors.Select(e => new ValidationFailure("Password", e.Description))));

            return user;
        }

        public async Task<User> Authorize(string userName, string password)
        {
            var user = await GetUserByUserName(userName);
            if (user is null)
            {
                user = await GetUserByEmail(userName);
            }

            Guard.Requires(() => user != null, new InvalidLoginCredentialsException(userName));
            await Guard.RequiresAsync(async () => await userManager.CheckPasswordAsync(user, password), new InvalidLoginCredentialsException(userName));

            return user;
        }
    }
}

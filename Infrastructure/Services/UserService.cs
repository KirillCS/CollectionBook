using Application.Common.Interfaces;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Domain.Common;
using Application.Common.Exceptions;
using Domain.Entities;
using Infrastructure.Exceptions;
using System.Security.Claims;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;

namespace Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> userManager;
        private readonly IRoleService roleService;

        public UserService(UserManager<User> userManager, IRoleService roleService)
        {
            this.userManager = userManager;
            this.roleService = roleService;
        }

        public async Task<User> Create(string login, string email, string password)
        {
            Role userRole = roleService.GetExistingRole(Roles.User);

            User user = new User(login) { Email = email, Role = userRole };
            IdentityResult result = await userManager.CreateAsync(user, password);
            Guard.Requires(() => result.Succeeded, new OperationException());

            return user;
        }

        public async Task<User> Authorize(string loginCredential, string password)
        {
            User user = await userManager.FindByNameAsync(loginCredential);
            if (user is null)
            {
                user = await userManager.FindByEmailAsync(loginCredential);
            }

            Guard.Requires(() => user is not null, new InvalidLoginCredentialsException(loginCredential));
            await Guard.RequiresAsync(async () => await userManager.CheckPasswordAsync(user, password), new InvalidLoginCredentialsException(loginCredential));
            if (this.IsUserInRole(user, Roles.Owner))
            {
                return user;
            }

            await Guard.RequiresAsync(async () => await userManager.IsEmailConfirmedAsync(user), new EmailNotConfirmedException(user.Id, user.Email));

            return user;
        }

        public IEnumerable<Claim> GetLoginClaims(User user) =>
            new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                new Claim("role", roleService.GetExistingRole(user.RoleId).Name)
            };

        public async Task<bool> CheckPassword(string userId, string currentPassword)
        {
            User user = await userManager.FindByIdAsync(userId);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            return await userManager.CheckPasswordAsync(user, currentPassword);
        }

        public bool IsUserInRole(User user, string roleName)
        {
            Role role = roleService.GetExistingRole(roleName);

            return user.RoleId == role.Id;
        }

        public async Task<bool> LoginExists(string login) =>
            !string.IsNullOrEmpty(login) && await userManager.FindByNameAsync(login) is not null;

        public async Task<bool> EmailExists(string email) =>
            !string.IsNullOrEmpty(email) && await userManager.FindByEmailAsync(email) is not null;
    }
}

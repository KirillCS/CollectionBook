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
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

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

        public async Task<User> GetUserById(string id)
        {
            return id is null ? null : await userManager.FindByIdAsync(id);
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

        public async Task<string> GenerateEmailConfirmationToken(User user)
        {
            return await userManager.GenerateEmailConfirmationTokenAsync(user);
        }

        public async Task<bool> IsEmailConfirmed(User user)
        {
            return await userManager.IsEmailConfirmedAsync(user);
        }

        public async Task SetEmail(User user, string email)
        {
            await userManager.SetEmailAsync(user, email);
        }

        public async Task<IdentityResult> ConfirmEmail(User user, string token)
        {
            return await userManager.ConfirmEmailAsync(user, token);
        }

        public async Task<string> GenerateChangeEmailToken(User user, string newEmail)
        {
            return await userManager.GenerateChangeEmailTokenAsync(user, newEmail);
        }

        public async Task<IdentityResult> ChangeEmail(User user, string newEmail, string token)
        {
            return await userManager.ChangeEmailAsync(user, newEmail, token);
        }

        public async Task<IdentityResult> SetUserName(User user, string userName)
        {
            return await userManager.SetUserNameAsync(user, userName);
        }

        public async Task<User> CreateUser(string userName, string email, string password)
        {
            var user = new User(userName) { Email = email };
            var result = await userManager.CreateAsync(user, password);
            Guard.Requires(() => result.Succeeded, new ValidationException(result.Errors.Select(e => new ValidationFailure("Password", e.Description))));
            
            return user;
        }

        public async Task<IdentityResult> UpdateUser(User user)
        {
            return await userManager.UpdateAsync(user);
        }

        public async Task<IEnumerable<Claim>> GetUserClaims(User user)
        {
            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

            var rolesClaim = (await GetUserRoles(user)).Select(c => new Claim("role", c));
            claims.AddRange(rolesClaim);

            return claims;
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
            await Guard.RequiresAsync(async () => await IsEmailConfirmed(user), new EmailNotConfirmedException(user.Id, user.Email));

            return user;
        }
    }
}

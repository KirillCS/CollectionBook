using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Common;
using Infrastructure.Exceptions;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Infrastructure.Identity
{
    class IdentityService : IIdentityService
    {
        private readonly UserManager<User> userManager;

        public IdentityService(UserManager<User> userManager)
        {
            this.userManager = userManager;
        }

        public async Task<bool> LoginExists(string login)
        {
            return !string.IsNullOrEmpty(login) && await userManager.FindByNameAsync(login) is not null;
        }

        public async Task<bool> EmailExists(string email)
        {
            return !string.IsNullOrEmpty(email) && await userManager.FindByEmailAsync(email) is not null;
        }

        public async Task<Result> SetLogin(string userId, string newLogin)
        {
            var user = await GetUser(userId);
            var result = await userManager.SetUserNameAsync(user, newLogin);

            return result.ToApplicationResult();
        }

        public async Task<Result> SetEmail(string userId, string newEmail)
        {
            var user = await GetUser(userId);
            var result = await userManager.SetEmailAsync(user, newEmail);

            return result.ToApplicationResult();
        }

        public async Task<string> GenerateEmailConfirmationToken(string userId)
        {
            var user = await GetUser(userId);

            return await userManager.GenerateEmailConfirmationTokenAsync(user);
        }

        public async Task<bool> IsEmailConfirmed(string userId)
        {
            var user = await GetUser(userId);

            return await userManager.IsEmailConfirmedAsync(user);
        }

        public async Task<Result> ConfirmEmail(string userId, string confirmationToken)
        {
            var user = await GetUser(userId);
            var result = await userManager.ConfirmEmailAsync(user, confirmationToken);

            return result.ToApplicationResult();
        }

        public async Task<string> GenerateEmailChangingToken(string userId, string newEmail)
        {
            var user = await GetUser(userId);

            return await userManager.GenerateChangeEmailTokenAsync(user, newEmail);
        }

        public async Task<Result> ChangeEmail(string userId, string newEmail, string emailChangingToken)
        {
            var user = await GetUser(userId);
            var result = await userManager.ChangeEmailAsync(user, newEmail, emailChangingToken);

            return result.ToApplicationResult();
        }

        public async Task<IEnumerable<string>> GetUserRoles(string userId)
        {
            var user = await GetUser(userId);

            return await userManager.GetRolesAsync(user);
        }

        public async Task<IEnumerable<Claim>> GetUserClaims(string userId)
        {
            var user = await GetUser(userId);
            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

            var rolesClaim = (await userManager.GetRolesAsync(user)).Select(c => new Claim("role", c));
            claims.AddRange(rolesClaim);

            return claims;
        }

        public async Task<bool> CheckPassword(string userId, string password)
        {
            var user = await GetUser(userId);

            return await userManager.CheckPasswordAsync(user, password);
        }

        public async Task<Result> ChangePassword(string userId, string currentPassword, string newPassword)
        {
            var user = await GetUser(userId);
            var result = await userManager.ChangePasswordAsync(user, currentPassword, newPassword);

            return result.ToApplicationResult();
        }

        public async Task<string> GeneratePasswordResetToken(string userId)
        {
            var user = await GetUser(userId);

            return await userManager.GeneratePasswordResetTokenAsync(user);
        }

        public async Task<Result> ResetPassword(string userId, string passwordResetToken, string newPassword)
        {
            var user = await GetUser(userId);
            var result = await userManager.ResetPasswordAsync(user, passwordResetToken, newPassword);

            return result.ToApplicationResult();
        }

        public async Task<string> Create(string userName, string email, string password)
        {
            var user = new User(userName) { Email = email };
            var result = await userManager.CreateAsync(user, password);
            Guard.Requires(() => result.Succeeded, new OperationException(result.Errors.Select(e => e.Description)));

            return user.Id;
        }

        public async Task<string> Authorize(string login, string password)
        {
            var user = await userManager.FindByNameAsync(login);
            if (user is null)
            {
                user = await userManager.FindByEmailAsync(login);
            }

            Guard.Requires(() => user != null, new InvalidLoginCredentialsException(login));
            await Guard.RequiresAsync(async () => await userManager.CheckPasswordAsync(user, password), new InvalidLoginCredentialsException(login));
            await Guard.RequiresAsync(async () => await userManager.IsEmailConfirmedAsync(user), new EmailNotConfirmedException(user.Id, user.Email));

            return user.Id;
        }

        protected async Task<User> GetUser(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            Guard.Requires(() => user is not null, new EntityNotFoundException(nameof(User), "id", userId));

            return user;
        }
    }
}

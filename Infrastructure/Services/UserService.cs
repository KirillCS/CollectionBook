using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Domain.Common;
using Application.Users.Commands.UpdateProfile;
using Application.Common.Exceptions;
using Domain.Entities;
using Infrastructure.Exceptions;
using System.Security.Claims;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> userManager;

        public UserService(UserManager<User> userManager)
        {
            this.userManager = userManager;
        }

        public async Task<User> Create(string login, string email, string password)
        {
            var user = new User(login) { Email = email };
            IdentityResult result = await userManager.CreateAsync(user, password);
            Guard.Requires(() => result.Succeeded, new OperationException());

            return user;
        }

        public async Task<User> Authorize(string loginCredential, string password)
        {
            var user = await userManager.FindByNameAsync(loginCredential);
            if (user is null)
            {
                user = await userManager.FindByEmailAsync(loginCredential);
            }

            Guard.Requires(() => user is not null, new InvalidLoginCredentialsException(loginCredential));
            await Guard.RequiresAsync(async () => await userManager.CheckPasswordAsync(user, password), new InvalidLoginCredentialsException(loginCredential));
            await Guard.RequiresAsync(async () => await userManager.IsEmailConfirmedAsync(user), new EmailNotConfirmedException(user.Id, user.Email));

            return user;
        }

        public async Task<IEnumerable<Claim>> GetLoginClaims(User user)
        {
            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

            IEnumerable<Claim> rolesClaim = (await userManager.GetRolesAsync(user)).Select(c => new Claim("role", c));
            claims.AddRange(rolesClaim);

            return claims;
        }

        public async Task<bool> CheckPassword(string userId, string currentPassword)
        {
            User user = await userManager.FindByIdAsync(userId);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            return await userManager.CheckPasswordAsync(user, currentPassword);
        }

        public async Task<bool> LoginExists(string login) =>
            !string.IsNullOrEmpty(login) && await userManager.FindByNameAsync(login) is not null;

        public async Task<bool> EmailExists(string email) =>
            !string.IsNullOrEmpty(email) && await userManager.FindByEmailAsync(email) is not null;


        //private readonly UserManager<User> userManager;
        //private readonly IMapper mapper;

        //public UserService(UserManager<User> userManager, IMapper mapper)
        //{
        //    this.userManager = userManager;
        //    this.mapper = mapper;
        //}

        //public async Task<UserDto> GetById(string id)
        //{
        //    var user = await userManager.FindByIdAsync(id);

        //    return mapper.Map<UserDto>(user);
        //}

        //public async Task<UserDto> GetByLogin(string login)
        //{
        //    var user = await userManager.FindByNameAsync(login);

        //    return mapper.Map<UserDto>(user);
        //}

        //public async Task<UserDto> GetByEmail(string email)
        //{
        //    var user = await userManager.FindByEmailAsync(email);

        //    return mapper.Map<UserDto>(user);
        //}

        //public async Task<Result> UpdateAvatar(string userId, string newAvatarPath)
        //{
        //    var user = await userManager.FindByIdAsync(userId);
        //    Guard.Requires(() => user is not null, new EntityNotFoundException(nameof(User), "id", userId));
        //    user.AvatarPath = newAvatarPath;
        //    var result = await userManager.UpdateAsync(user);

        //    return result.ToApplicationResult();
        //}

        //public async Task<Result> ResetAvatar(string userId)
        //{
        //    var user = await userManager.FindByIdAsync(userId);
        //    Guard.Requires(() => user is not null, new EntityNotFoundException(nameof(User), "id", userId));
        //    user.AvatarPath = null;
        //    var result = await userManager.UpdateAsync(user);

        //    return result.ToApplicationResult();
        //}

        //public async Task<Result> UpdateProfile(string userId, UpdateProfileCommand command)
        //{
        //    var user = await userManager.FindByIdAsync(userId);
        //    Guard.Requires(() => user is not null, new EntityNotFoundException(nameof(User), "id", userId));
        //    command.CopyPropertiesTo(user);
        //    var result = await userManager.UpdateAsync(user);

        //    return result.ToApplicationResult();
        //}
    }
}

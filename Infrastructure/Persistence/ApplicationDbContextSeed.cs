using Domain.Common;
using Domain.Entities;
using Infrastructure.Options;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Infrastructure.Persistence
{
    public static class ApplicationDbContextSeed
    {
        public static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            Guard.Requires(() => roleManager is not null, new ArgumentNullException(nameof(roleManager)));

            if (!await roleManager.RoleExistsAsync(Roles.Owner))
            {
                await roleManager.CreateAsync(new IdentityRole(Roles.Owner));
            }

            if (!await roleManager.RoleExistsAsync(Roles.Admin))
            {
                await roleManager.CreateAsync(new IdentityRole(Roles.Admin));
            }
        }

        public static async Task SeedOwner(UserManager<User> userManager, OwnerDefaultCreds options)
        {
            if ((await userManager.GetUsersInRoleAsync(Roles.Owner)).Count != 0)
            {
                return;
            }

            Guard.Requires(() => options is not null, new ArgumentNullException(nameof(options)));
            Guard.Requires(() => !string.IsNullOrEmpty(options.Login), new ArgumentException("Owner login must be setted (not null or empty)", nameof(options)));
            Guard.Requires(() => !string.IsNullOrEmpty(options.Password), new ArgumentException("Owner password must be setted (not null or empty)", nameof(options)));
            Guard.Requires(() => CheckPassword(options.Password), new ArgumentException("Owner password must have the length more than 5, contain at least one lowercase english letter, one uppercase english letter and one number"));

            var owner = new User(options.Login);
            await userManager.CreateAsync(owner, options.Password);
            await userManager.AddToRoleAsync(owner, Roles.Owner);
        }

        private static bool CheckPassword(string password) =>
            Regex.IsMatch(password, @"^(?=.*[a-z])(?=.*?[A-Z])(?=.*\d)([a-zA-Z\d]|.){6,}$");
    }
}

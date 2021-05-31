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
        public static async Task SeedRoles(ApplicationDbContext context)
        {
            Guard.Requires(() => context is not null, new ArgumentNullException(nameof(context)));

            await AddRole(context, Roles.User);
            await AddRole(context, Roles.Admin);
            await AddRole(context, Roles.Owner);

            await context.SaveChangesAsync();
        }

        public static async Task SeedOwner(UserManager<User> userManager, ApplicationDbContext context, OwnerDefaultCreds options)
        {
            Role ownerRole = context.Roles.FirstOrDefault(r => r.Name == Roles.Owner);
            Guard.Requires(() => ownerRole is not null, new InvalidOperationException("Cannot create the owner because of the owner role doesn't exist"));
            if (context.Users.Any(u => u.RoleId == ownerRole.Id))
            {
                return;
            }

            Guard.Requires(() => options is not null, new ArgumentNullException(nameof(options)));
            Guard.Requires(() => !string.IsNullOrEmpty(options.Login), new ArgumentException("Owner login must be setted (not null or empty)", nameof(options)));
            Guard.Requires(() => !string.IsNullOrEmpty(options.Password), new ArgumentException("Owner password must be setted (not null or empty)", nameof(options)));
            Guard.Requires(() => CheckPassword(options.Password), new ArgumentException("Owner password must have the length more than 5, contain at least one lowercase english letter, one uppercase english letter and one number"));

            var owner = new User(options.Login) { RoleId = ownerRole.Id };
            await userManager.CreateAsync(owner, options.Password);

            await context.SaveChangesAsync();
        }

        private static async Task AddRole(ApplicationDbContext context, string role)
        {
            if (!context.Roles.Any(r => r.Name == role))
            {
                await context.Roles.AddAsync(new Role(role));
            }
        }

        private static bool CheckPassword(string password) =>
            Regex.IsMatch(password, @"^(?=.*[a-z])(?=.*?[A-Z])(?=.*\d)([a-zA-Z\d]|.){6,}$");
    }
}

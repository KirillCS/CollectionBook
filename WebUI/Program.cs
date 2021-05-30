using Domain.Entities;
using Infrastructure.Options;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace WebUI
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            IHost host = CreateHostBuilder(args).Build();

            using (IServiceScope scope = host.Services.CreateScope())
            {
                IServiceProvider servicesProvider = scope.ServiceProvider;

                ApplicationDbContext context = servicesProvider.GetRequiredService<ApplicationDbContext>();
                    
                context.Database.Migrate();

                RoleManager<IdentityRole> roleManager = servicesProvider.GetRequiredService<RoleManager<IdentityRole>>();
                UserManager<User> userManager = servicesProvider.GetRequiredService<UserManager<User>>();
                IOptions<OwnerDefaultCreds> options = servicesProvider.GetRequiredService<IOptions<OwnerDefaultCreds>>();

                await ApplicationDbContextSeed.SeedRoles(roleManager);
                await ApplicationDbContextSeed.SeedOwner(userManager, options.Value);
            }

            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
                .ConfigureAppConfiguration((hostContext, builder) =>
                {
                    builder.AddUserSecrets<Program>();
                });
    }
}

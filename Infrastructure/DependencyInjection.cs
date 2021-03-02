using Application.Common.Interfaces;
using Domain.Entities;
using Infrastructure.Models;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnectionString")));
            services.AddScoped<IApplicationDbContext>(providers => providers.GetService<ApplicationDbContext>());

            services.AddIdentityCore<User>(options => options.Password.RequireNonAlphanumeric = false)
                    .AddRoles<IdentityRole>()
                    .AddEntityFrameworkStores<ApplicationDbContext>();

            services.Configure<AuthOptions>(configuration.GetSection("Auth"));
            services.AddTransient<IJwtService, JwtService>();

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });

            services.AddTransient<IUserService, UserService>();

            return services;
        }
    }
}

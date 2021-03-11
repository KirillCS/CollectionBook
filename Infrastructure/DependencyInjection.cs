using Application.Common.Interfaces;
using Domain.Entities;
using Infrastructure.Models;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnectionString")));
            services.AddScoped<IApplicationDbContext>(providers => providers.GetService<ApplicationDbContext>());

            services.AddIdentityCore<User>(options => 
                    {
                        options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
                        options.User.RequireUniqueEmail = true;

                        options.Password.RequireDigit = true;
                        options.Password.RequiredLength = 6;
                        options.Password.RequireNonAlphanumeric = false;
                        options.Password.RequiredUniqueChars = 0;
                        options.Password.RequireLowercase = true;
                        options.Password.RequireUppercase = true;
                    })
                    .AddRoles<IdentityRole>()
                    .AddEntityFrameworkStores<ApplicationDbContext>()
                    .AddDefaultTokenProviders();

            var authOptionsSection = configuration.GetSection("Auth");
            services.Configure<AuthOptions>(authOptionsSection);
            services.AddTransient<IJwtService, JwtService>();
            var authOptions = authOptionsSection.Get<AuthOptions>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        options.RequireHttpsMetadata = false;
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidIssuer = authOptions.Issuer,

                            ValidateAudience = true,
                            ValidAudience = authOptions.Audience,

                            ValidateLifetime = true,
                            
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = authOptions.SymmetricSecurityKey
                        };
                    });

            services.Configure<SmtpOptions>(configuration.GetSection("Smtp"));
            services.Configure<EmailOptions>(configuration.GetSection("Email"));
            services.Configure<SpaOptions>(configuration.GetSection("Spa"));

            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IEmailConfirmationUriService, EmailConfirmationUriService>();
            services.AddTransient<IEmailMessageService, EmailMessageService>();
            services.AddTransient<IEmailSenderService, EmailSenderService>();
            services.AddTransient<IEmailConfirmationSenderService, EmailConfirmationSenderService>();

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });


            return services;
        }
    }
}

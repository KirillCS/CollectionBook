using Application.Common.Interfaces;
using Infrastructure.Options;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using Domain.Entities;

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
                        options.User.AllowedUserNameCharacters = string.Empty;
                        options.User.RequireUniqueEmail = false;

                        options.Password.RequireDigit = false;
                        options.Password.RequiredLength = 0;
                        options.Password.RequireNonAlphanumeric = false;
                        options.Password.RequiredUniqueChars = 0;
                        options.Password.RequireLowercase = false;
                        options.Password.RequireUppercase = false;
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
            services.Configure<FilePathsOptions>(configuration.GetSection("FilePaths"));
            services.Configure<OwnerDefaultCreds>(configuration.GetSection("OwnerDefaultCreds"));

            services.AddTransient<IUserService, UserService>();

            services.AddTransient<IUriService, UriService>();
            services.AddTransient<IUriExtensionsService, UriExtensionsService>();

            services.AddTransient<IFileService, FileService>();
            services.AddTransient<IFileExtensionsService, FileExtensionsService>();

            services.AddTransient<IEmailMessageService, EmailMessageService>();
            services.AddTransient<IEmailMessageExtensionsService, EmailMessageExtensionsService>();
            services.AddTransient<IEmailSenderService, EmailSenderService>();

            services.AddTransient<ITagService, TagService>();

            services.AddAutoMapper(Assembly.GetExecutingAssembly());
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

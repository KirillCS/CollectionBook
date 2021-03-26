using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Infrastructure;
using Application;
using WebUI.Filters;
using Application.Common.Interfaces;
using WebUI.Services;
using WebUI.Interfaces;
using WebUI.Options;

namespace WebUI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplication()
                    .AddInfrastructure(Configuration);

            services.AddControllers(options => options.Filters.Add<ApiControllerExceptionFilterAttribute>());

            services.AddSingleton<ICurrentUserService, CurrentUserService>();
            services.AddHttpContextAccessor();

            services.AddTransient<IFormFileSaver, FormFileSaver>();
            services.AddTransient<IFileRemoverService, FileRemoverService>();
            services.AddTransient<IAvatarService, AvatarService>();
            services.AddTransient<ICollectionCoverService, CollectionCoverService>();
            services.Configure<FilePathsOptions>(Configuration.GetSection("FilePaths"));

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebUI", Version = "v1" });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebUI v1"));
            }

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}

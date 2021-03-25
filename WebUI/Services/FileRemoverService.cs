using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using System.IO;
using WebUI.Interfaces;
using WebUI.Options;

namespace WebUI.Services
{
    public class FileRemoverService : IFileRemoverService
    {
        private readonly IWebHostEnvironment environment;
        private readonly FilePathsOptions filePaths;

        public FileRemoverService(IWebHostEnvironment environment, IOptions<FilePathsOptions> filePathsOptions)
        {
            this.environment = environment;
            this.filePaths = filePathsOptions.Value;
        }

        public void RemoveAvatar(string avatarPath)
        {
            var fullPath = Path.Combine(environment.WebRootPath, filePaths.Avatars, avatarPath);

            RemoveFile(fullPath);
        }

        public void RemoveFile(string fullPath)
        {
            if (!File.Exists(fullPath))
            {
                return;
            }

            File.Delete(fullPath);
        }
    }
}

using Microsoft.AspNetCore.Hosting;
using System.IO;
using WebUI.Interfaces;

namespace WebUI.Services
{
    public class FileRemoverService : IFileRemoverService
    {
        private readonly IWebHostEnvironment environment;

        public FileRemoverService(IWebHostEnvironment environment)
        {
            this.environment = environment;
        }

        public void RemoveFile(string filePath)
        {
            var fullPath = Path.Combine(environment.WebRootPath, filePath);
            if (!File.Exists(fullPath))
            {
                return;
            }

            File.Delete(fullPath);
        }
    }
}

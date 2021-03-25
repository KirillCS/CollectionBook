using WebUI.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using WebUI.Options;
using System.IO;
using WebUI.Exceptions;

namespace WebUI.Services
{
    public class FormFileSaver : IFormFileSaver
    {
        private readonly IWebHostEnvironment environment;
        private readonly FilePathsOptions filePaths;

        public FormFileSaver(IWebHostEnvironment environment, IOptions<FilePathsOptions> filePathsOptions)
        {
            this.environment = environment;
            this.filePaths = filePathsOptions.Value;
        }

        public async Task<string> SaveAvatar(IFormFile avatar, string fileName)
        {
            var fullPath = Path.Combine(environment.WebRootPath, filePaths.Avatars);
            return await SaveFile(avatar, fullPath, fileName);
        }

        public async Task<string> SaveFile(IFormFile file, string fullPath, string fileName)
        {
            if (!Directory.Exists(fullPath))
            {
                Directory.CreateDirectory(fullPath);
            }

            var fileNameWithExtension = Path.HasExtension(file.FileName) ? $"{fileName}{Path.GetExtension(file.FileName)}" : fileName;
            var pathToFile = Path.Combine(fullPath, fileNameWithExtension);
            try
            {
                using var stream = new FileStream(pathToFile, FileMode.Create);
                await file.CopyToAsync(stream);
            }
            catch (Exception)
            {
                throw new FileSaveException();
            }
            
            return fileNameWithExtension;
        }
    }
}

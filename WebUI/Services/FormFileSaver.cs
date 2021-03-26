using WebUI.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using WebUI.Exceptions;

namespace WebUI.Services
{
    public class FormFileSaver : IFormFileSaver
    {
        private readonly IWebHostEnvironment environment;

        public FormFileSaver(IWebHostEnvironment environment)
        {
            this.environment = environment;
        }

        public async Task<string> SaveFile(IFormFile file, string filePath, string fileName)
        {
            var fullPath = Path.Combine(environment.WebRootPath, filePath);
            if (!Directory.Exists(fullPath))
            {
                Directory.CreateDirectory(fullPath);
            }

            fileName = Path.HasExtension(file.FileName) ? $"{fileName}{Path.GetExtension(file.FileName)}" : fileName;
            fullPath = Path.Combine(fullPath, fileName);
            try
            {
                using var stream = new FileStream(fullPath, FileMode.Create);
                await file.CopyToAsync(stream);
            }
            catch (Exception)
            {
                throw new FileSaveException();
            }
            
            return Path.Combine(filePath, fileName);
        }
    }
}

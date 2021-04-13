using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Application.Common.Interfaces;
using Application.Common.Exceptions;

namespace Infrastructure.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment environment;

        public FileService(IWebHostEnvironment environment)
        {
            this.environment = environment;
        }

        public async Task<string> Save(IFormFile file, string filePath, string fileName)
        {
            string fullPath = Path.Combine(environment.WebRootPath, filePath);
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

        public void Remove(string path)
        {
            string fullPath = Path.Combine(environment.WebRootPath, path);
            if (!File.Exists(fullPath))
            {
                return;
            }

            File.Delete(fullPath);
        }
    }
}

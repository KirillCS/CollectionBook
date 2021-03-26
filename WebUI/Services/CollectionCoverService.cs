using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Threading.Tasks;
using WebUI.Interfaces;
using WebUI.Options;

namespace WebUI.Services
{
    public class CollectionCoverService : ICollectionCoverService
    {
        private readonly IWebHostEnvironment environment;
        private readonly IFormFileSaver fileSaver;
        private readonly FilePathsOptions filePaths;

        public CollectionCoverService(IWebHostEnvironment environment, IOptions<FilePathsOptions> filePathsOptions, IFormFileSaver fileSaver)
        {
            this.environment = environment;
            this.fileSaver = fileSaver;
            filePaths = filePathsOptions.Value;
        }

        public async Task<string> SaveCover(IFormFile cover)
        {
            string pathToCovers = Path.Combine(environment.WebRootPath, filePaths.CollectionsCovers);
            return await fileSaver.SaveFile(cover, pathToCovers, Guid.NewGuid().ToString());
        }
    }
}

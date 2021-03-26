using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;
using WebUI.Interfaces;
using WebUI.Options;

namespace WebUI.Services
{
    public class CollectionCoverService : ICollectionCoverService
    {
        private readonly IFormFileSaver fileSaver;
        private readonly FilePathsOptions filePaths;

        public CollectionCoverService(IOptions<FilePathsOptions> filePathsOptions, IFormFileSaver fileSaver)
        {
            this.fileSaver = fileSaver;
            filePaths = filePathsOptions.Value;
        }

        public async Task<string> SaveCover(IFormFile cover)
        {
            return await fileSaver.SaveFile(cover, filePaths.CollectionsCovers, Guid.NewGuid().ToString());
        }
    }
}

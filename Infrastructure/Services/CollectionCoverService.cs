using Application.Common.Interfaces;
using Infrastructure.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class CollectionCoverService : ICollectionCoverService
    {
        private readonly IFileService fileSaver;
        private readonly FilePathsOptions filePaths;

        public CollectionCoverService(IOptions<FilePathsOptions> filePathsOptions, IFileService fileSaver)
        {
            this.fileSaver = fileSaver;
            filePaths = filePathsOptions.Value;
        }

        public async Task<string> Save(IFormFile cover)
        {
            return await fileSaver.Save(cover, filePaths.CollectionsCovers, Guid.NewGuid().ToString());
        }
    }
}

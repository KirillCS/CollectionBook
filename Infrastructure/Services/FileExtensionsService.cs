using Application.Common.Interfaces;
using Infrastructure.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class FileExtensionsService : IFileExtensionsService
    {
        private readonly IFileService fileSaver;
        private readonly FilePathsOptions filePaths;

        public FileExtensionsService(IOptions<FilePathsOptions> filePathsOptions, IFileService fileSaver)
        {
            this.fileSaver = fileSaver;
            filePaths = filePathsOptions.Value;
        }

        public async Task<string> UpdateAvatar(IFormFile avatar, string currentAvatar)
        {
            if (currentAvatar is not null)
            {
                fileSaver.Remove(currentAvatar);
            }

            if (avatar is null)
            {
                return null;
            }

            return await fileSaver.Save(avatar, filePaths.Avatars, Guid.NewGuid().ToString());
        }

        public async Task<string> UpdateCollectionCover(IFormFile cover, string currentCover)
        {
            if (currentCover is not null)
            {
                fileSaver.Remove(currentCover);
            }

            if (cover is null)
            {
                return null;
            }

            return await fileSaver.Save(cover, filePaths.CollectionsCovers, Guid.NewGuid().ToString());
        }

        public async Task<string> SaveItemImage(IFormFile image) =>
            await fileSaver.Save(image, filePaths.ItemsImages, Guid.NewGuid().ToString());
    }
}

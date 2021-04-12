using Application.Common.Interfaces;
using Infrastructure.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class AvatarService : IAvatarService
    {
        private readonly IFileService fileSaver;
        private readonly FilePathsOptions filePaths;

        public AvatarService(IOptions<FilePathsOptions> filePathsOptions, IFileService fileSaver)
        {
            this.fileSaver = fileSaver;
            filePaths = filePathsOptions.Value;
        }

        public async Task<string> Update(IFormFile avatar, string currentAvatar)
        {
            if (currentAvatar is not null)
            {
                fileSaver.Remove(currentAvatar);
            }

            return await fileSaver.Save(avatar, filePaths.Avatars, Guid.NewGuid().ToString());
        }
    }
}

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;
using WebUI.Interfaces;
using WebUI.Options;

namespace WebUI.Services
{
    public class AvatarService : IAvatarService
    {
        private readonly IFormFileSaver fileSaver;
        private readonly FilePathsOptions filePaths;
        private readonly ICurrentUserService currentUserService;
        private readonly IUserService userService;
        private readonly IFileRemoverService fileRemoverService;

        public AvatarService(IFormFileSaver fileSaver,
                             IOptions<FilePathsOptions> filePathsOptions,
                             ICurrentUserService currentUserService,
                             IUserService userService,
                             IFileRemoverService fileRemoverService)
        {
            this.fileSaver = fileSaver;
            filePaths = filePathsOptions.Value;
            this.currentUserService = currentUserService;
            this.userService = userService;
            this.fileRemoverService = fileRemoverService;
        }

        public async Task<string> UpdateAvatar(IFormFile avatar)
        {
            var avatarPath = await fileSaver.SaveFile(avatar, filePaths.Avatars, Guid.NewGuid().ToString());
            var user = await userService.GetById(currentUserService.UserId);
            Guard.Requires(() => user is not null, new EntityNotFoundException());
            if (!string.IsNullOrEmpty(user.AvatarPath))
            {
                fileRemoverService.RemoveFile(user.AvatarPath);
            }

            return avatarPath;
        }

        public async Task ResetAvatar()
        {
            var user = await userService.GetById(currentUserService.UserId);
            Guard.Requires(() => user is not null, new EntityNotFoundException());
            if (!string.IsNullOrEmpty(user.AvatarPath))
            {
                fileRemoverService.RemoveFile(user.AvatarPath);
            }
        }
    }
}

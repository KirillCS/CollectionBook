using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;
using WebUI.Interfaces;

namespace WebUI.Services
{
    public class AvatarService : IAvatarService
    {
        private readonly IFormFileSaver fileSaver;
        private readonly ICurrentUserService currentUserService;
        private readonly IUserService userService;
        private readonly IFileRemoverService fileRemoverService;

        public AvatarService(IFormFileSaver fileSaver,
                             ICurrentUserService currentUserService,
                             IUserService userService,
                             IFileRemoverService fileRemoverService)
        {
            this.fileSaver = fileSaver;
            this.currentUserService = currentUserService;
            this.userService = userService;
            this.fileRemoverService = fileRemoverService;
        }

        public async Task<string> UpdateAvatar(IFormFile avatar)
        {
            var newFileName = await fileSaver.SaveAvatar(avatar, $"{currentUserService.Login}_{Guid.NewGuid()}");
            var user = await userService.GetById(currentUserService.UserId);
            Guard.Requires(() => user is not null, new EntityNotFoundException());
            if (!string.IsNullOrEmpty(user.AvatarPath))
            {
                fileRemoverService.RemoveAvatar(user.AvatarPath);
            }

            return newFileName;
        }

        public Task<string> ResetAvatar()
        {
            throw new NotImplementedException();
        }
    }
}

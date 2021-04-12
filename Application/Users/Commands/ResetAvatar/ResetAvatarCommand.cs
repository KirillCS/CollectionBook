using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.ResetAvatar
{
    public class ResetAvatarCommand : IRequest
    { }

    public class ResetAvatarCommandHandler : IRequestHandler<ResetAvatarCommand>
    {
        private readonly UserManager<User> userManager;
        private readonly ICurrentUserService currentUserService;
        private readonly IFileService fileService;

        public ResetAvatarCommandHandler(UserManager<User> userManager, ICurrentUserService currentUserService, IFileService fileService)
        {
            this.userManager = userManager;
            this.currentUserService = currentUserService;
            this.fileService = fileService;
        }

        public async Task<Unit> Handle(ResetAvatarCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(currentUserService.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            if (user.AvatarPath is null)
            {
                return Unit.Value;
            }

            fileService.Remove(user.AvatarPath);

            user.AvatarPath = null;

            IdentityResult result = await userManager.UpdateAsync(user);
            Guard.Requires(() => result.Succeeded, new OperationException());

            return Unit.Value;
        }
    }
}

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.UpdateAvatar
{
    public class UpdateAvatarCommand : IRequest
    {
        public IFormFile Avatar { get; set; }
    }

    public class UpdateAvatarCommandHandler : IRequestHandler<UpdateAvatarCommand>
    {
        private readonly ICurrentUserService currentUserService;
        private readonly UserManager<User> userManager;
        private readonly IAvatarService avatarService;

        public UpdateAvatarCommandHandler(ICurrentUserService currentUserService, UserManager<User> userManager, IAvatarService avatarService)
        {
            this.currentUserService = currentUserService;
            this.userManager = userManager;
            this.avatarService = avatarService;
        }

        public async Task<Unit> Handle(UpdateAvatarCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(currentUserService.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            user.AvatarPath = await avatarService.Update(request.Avatar, user.AvatarPath);

            IdentityResult result = await userManager.UpdateAsync(user);
            Guard.Requires(() => result.Succeeded, new OperationException());

            return Unit.Value;
        }
    }
}

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.UpdateAvatar
{
    public class UpdateAvatarCommand : IRequest
    {
        public string AvatarPath { get; set; }
    }

    public class UpdateAvatarCommandHandler : IRequestHandler<UpdateAvatarCommand>
    {
        private readonly ICurrentUserService currentUserService;
        private readonly IUserService userService;

        public UpdateAvatarCommandHandler(ICurrentUserService currentUserService, IUserService userService)
        {
            this.currentUserService = currentUserService;
            this.userService = userService;
        }

        public async Task<Unit> Handle(UpdateAvatarCommand request, CancellationToken cancellationToken)
        {
            var result = await userService.UpdateAvatar(currentUserService.UserId, request.AvatarPath);
            Guard.Requires(() => result.Successed, new OperationException(result.Errors));

            return Unit.Value;
        }
    }
}

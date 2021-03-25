using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.ResetAvatar
{
    public class ResetAvatarCommand : IRequest
    { }

    public class ResetAvatarCommandHandler : IRequestHandler<ResetAvatarCommand>
    {
        private readonly ICurrentUserService currentUserService;
        private readonly IUserService userService;

        public ResetAvatarCommandHandler(ICurrentUserService currentUserService, IUserService userService)
        {
            this.currentUserService = currentUserService;
            this.userService = userService;
        }

        public async Task<Unit> Handle(ResetAvatarCommand request, CancellationToken cancellationToken)
        {
            var result = await userService.ResetAvatar(currentUserService.UserId);
            Guard.Requires(() => result.Successed, new OperationException(result.Errors));

            return Unit.Value;
        }
    }
}

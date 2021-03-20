using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.UpdatePassword
{
    public class UpdatePasswordCommand : IRequest
    {
        public string CurrentPassword { get; set; }

        public string NewPassword { get; set; }

        public string PasswordConfirmation { get; set; }
    }

    public class UpdatePasswordCommandHandler : IRequestHandler<UpdatePasswordCommand>
    {
        private readonly IIdentityService identityService;
        private readonly ICurrentUserService currentUserService;

        public UpdatePasswordCommandHandler(IIdentityService identityService, ICurrentUserService currentUserService)
        {
            this.identityService = identityService;
            this.currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(UpdatePasswordCommand request, CancellationToken cancellationToken)
        {
            var result = await identityService.ChangePassword(currentUserService.UserId, request.CurrentPassword, request.NewPassword);
            Guard.Requires(() => result.Successed, new OperationException(result.Errors));

            return Unit.Value;
        }
    }
}

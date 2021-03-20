using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.ResetPassword
{
    public class ResetPasswordCommand : IRequest
    {
        public string Id { get; set; }

        public string Password { get; set; }

        public string PasswordConfirmation { get; set; }

        public string Token { get; set; }
    }

    public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand>
    {
        private readonly IIdentityService identityService;

        public ResetPasswordCommandHandler(IIdentityService identityService)
        {
            this.identityService = identityService;
        }

        public async Task<Unit> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            var result = await identityService.ResetPassword(request.Id, request.Token, request.Password);
            Guard.Requires(() => result.Successed, new OperationException(result.Errors));

            return Unit.Value;
        }
    }
}

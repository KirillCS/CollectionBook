using Application.Auth.Commands.Login;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.UserEmail.Commands.ConfirmEmail
{
    public class ConfirmEmailCommand : IRequest<LoginResponse>
    {
        public string Id { get; set; }

        public string Token { get; set; }
    }

    public class ConfirmEmailCommandHandler : IRequestHandler<ConfirmEmailCommand, LoginResponse>
    {
        private readonly IIdentityService identityService;
        private readonly IJwtService jwtService;

        public ConfirmEmailCommandHandler(IIdentityService identityService, IJwtService jwtService)
        {
            this.identityService = identityService;
            this.jwtService = jwtService;
        }

        public async Task<LoginResponse> Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
        {
            var result = await identityService.ConfirmEmail(request.Id, request.Token);
            Guard.Requires(() => result.Successed, new OperationException(result.Errors, 400));
            var claims = await identityService.GetUserClaims(request.Id);
            var token = jwtService.GenerateJwt(claims);

            return new LoginResponse() { AccessToken = token };
        }
    }
}

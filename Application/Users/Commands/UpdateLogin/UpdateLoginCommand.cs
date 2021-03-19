using Application.Auth.Commands.Login;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.UpdateLogin
{
    public class UpdateLoginCommand: IRequest<LoginResponse>
    {
        public string Login { get; set; }
    }

    public class UpdateLoginCommandHandler : IRequestHandler<UpdateLoginCommand, LoginResponse>
    {
        private readonly IIdentityService identityService;
        private readonly ICurrentUserService currentUserService;
        private readonly IJwtService jwtService;

        public UpdateLoginCommandHandler(IIdentityService identityService, ICurrentUserService currentUserService, IJwtService jwtService)
        {
            this.identityService = identityService;
            this.currentUserService = currentUserService;
            this.jwtService = jwtService;
        }

        public async Task<LoginResponse> Handle(UpdateLoginCommand request, CancellationToken cancellationToken)
        {
            var result = await identityService.SetLogin(currentUserService.UserId, request.Login);
            Guard.Requires(() => result.Successed, new OperationException(result.Errors));
            var claims = await identityService.GetUserClaims(currentUserService.UserId);
            var token = jwtService.GenerateJwt(claims);

            return new LoginResponse { AccessToken = token };
        }
    }
}

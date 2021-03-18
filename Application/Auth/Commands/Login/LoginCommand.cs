using Application.Common.Interfaces;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Auth.Commands.Login
{
    public class LoginCommand : IRequest<LoginResponse>
    {
        public string Login { get; set; }

        public string Password { get; set; }
    }

    public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
    {
        private readonly IIdentityService identityService;
        private readonly IJwtService jwtService;

        public LoginCommandHandler(IIdentityService identityService, IJwtService jwtService)
        {
            this.identityService = identityService;
            this.jwtService = jwtService;
        }

        public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var id = await identityService.Authorize(request.Login, request.Password);
            var claims = await identityService.GetUserClaims(id);
            string token = jwtService.GenerateJwt(claims);

            return new LoginResponse { AccessToken = token };
        }
    }
}

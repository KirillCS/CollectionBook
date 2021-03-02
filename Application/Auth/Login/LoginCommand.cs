using Application.Common.Interfaces;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Auth.Login
{
    public class LoginCommand : IRequest<string>
    {
        public string Login { get; set; }

        public string Password { get; set; }
    }

    public class LoginCommandHandler : IRequestHandler<LoginCommand, string>
    {
        private readonly IUserService userService;
        private readonly IJwtService jwtService;

        public LoginCommandHandler(IUserService userService, IJwtService jwtService)
        {
            this.userService = userService;
            this.jwtService = jwtService;
        }

        public async Task<string> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.Authorize(request.Login, request.Password);
            return await jwtService.GenerateJwt(user);
        }
    }
}

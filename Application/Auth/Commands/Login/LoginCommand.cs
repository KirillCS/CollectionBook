using Application.Common.Dto;
using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Auth.Commands.Login
{
    public class LoginCommand : IRequest<LoginDto>
    {
        public string Login { get; set; }

        public string Password { get; set; }
    }

    public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginDto>
    {
        private readonly IUserService userService;
        private readonly IJwtService jwtService;

        public LoginCommandHandler(IUserService userService, IJwtService jwtService)
        {
            this.userService = userService;
            this.jwtService = jwtService;
        }

        public async Task<LoginDto> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            User user = await userService.Authorize(request.Login, request.Password);
            IEnumerable<Claim> claims = userService.GetLoginClaims(user);
            string token = jwtService.GenerateJwt(claims);

            return new LoginDto { AccessToken = token };
        }
    }
}

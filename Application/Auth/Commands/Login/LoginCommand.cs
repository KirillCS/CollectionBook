using Application.Common.Interfaces;
using AutoMapper;
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
        private readonly IUserService userService;
        private readonly IJwtService jwtService;
        private readonly IMapper mapper;

        public LoginCommandHandler(IUserService userService, IJwtService jwtService, IMapper mapper)
        {
            this.userService = userService;
            this.jwtService = jwtService;
            this.mapper = mapper;
        }

        public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.Authorize(request.Login, request.Password);
            string token = await jwtService.GenerateJwt(user);

            return new LoginResponse { User = mapper.Map<LoginUserDto>(user), AccessToken = token };
        }
    }
}

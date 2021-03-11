using Application.Common.Interfaces;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Auth.Commands.Register
{
    public class RegisterCommand : IRequest<string>
    {
        public string Login { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string PasswordConfirmation { get; set; }
    }

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, string>
    {
        private readonly IUserService userService;
        private readonly IJwtService jwtService;

        public RegisterCommandHandler(IUserService userService, IJwtService jwtService)
        {
            this.userService = userService;
            this.jwtService = jwtService;
        }

        public async Task<string> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.CreateUser(request.Login, request.Email, request.Password);
            return await jwtService.GenerateJwt(user);
        }
    }
}

using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Auth.Commands.Register
{
    public class RegisterCommand : IRequest<User>
    {
        public string Login { get; set; }

        public string Password { get; set; }

        public string PasswordConfirmation { get; set; }
    }

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, User>
    {
        private readonly IUserService userService;

        public RegisterCommandHandler(IUserService userService)
        {
            this.userService = userService;
        }

        public async Task<User> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            return await userService.CreateUser(request.Login, request.Password);
        }
    }
}

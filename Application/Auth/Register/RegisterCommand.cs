using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Auth.Register
{
    public class RegisterCommand : IRequest<string>
    {
        public string Login { get; set; }

        public string Password { get; set; }

        public string PasswordConfirmation { get; set; }
    }

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, string>
    {
        private readonly UserManager<User> userManager;

        public RegisterCommandHandler(UserManager<User> userManager)
        {
            this.userManager = userManager;
        }

        public async Task<string> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            return null;
        }
    }
}

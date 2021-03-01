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
        public LoginCommandHandler()
        {

        }

        public Task<string> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            return null;
        }
    }
}

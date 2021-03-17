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
        private readonly IUserService userService;
        private readonly IJwtService jwtService;

        public ConfirmEmailCommandHandler(IUserService userService, IJwtService jwtService)
        {
            this.userService = userService;
            this.jwtService = jwtService;
        }

        public async Task<LoginResponse> Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserById(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());
            var result = await userService.ConfirmEmail(user, request.Token);
            Guard.Requires(() => result.Succeeded, new EmailConfirmationException(result.Errors));
            var claims = await userService.GetUserClaims(user);

            return new LoginResponse() { AccessToken = jwtService.GenerateJwt(claims) };
        }
    }
}

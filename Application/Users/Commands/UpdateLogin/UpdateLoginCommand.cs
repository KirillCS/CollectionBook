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
        private readonly IUserService userService;
        private readonly ICurrentUserService currentUserService;
        private readonly IJwtService jwtService;

        public UpdateLoginCommandHandler(IUserService userService, ICurrentUserService currentUserService, IJwtService jwtService)
        {
            this.userService = userService;
            this.currentUserService = currentUserService;
            this.jwtService = jwtService;
        }

        public async Task<LoginResponse> Handle(UpdateLoginCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserById(currentUserService.UserId);
            Guard.Requires(() => user is not null, new EntityNotFoundException());
            await userService.SetUserName(user, request.Login);
            var claims = await userService.GetUserClaims(user);
            var token = jwtService.GenerateJwt(claims);

            return new LoginResponse { AccessToken = token };
        }
    }
}

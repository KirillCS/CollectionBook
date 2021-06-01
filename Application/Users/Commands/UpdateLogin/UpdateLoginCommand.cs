using Application.Common.Attributes;
using Application.Common.Dto;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.UpdateLogin
{
    [Authorize]
    public class UpdateLoginCommand: IRequest<LoginDto>
    {
        public string Login { get; set; }
    }

    public class UpdateLoginCommandHandler : IRequestHandler<UpdateLoginCommand, LoginDto>
    {
        private readonly UserManager<User> userManager;
        private readonly IUserService userService;
        private readonly ICurrentUserService currentUserService;
        private readonly IJwtService jwtService;

        public UpdateLoginCommandHandler(UserManager<User> userManager, IUserService userService, ICurrentUserService currentUserService, IJwtService jwtService)
        {
            this.userManager = userManager;
            this.userService = userService;
            this.currentUserService = currentUserService;
            this.jwtService = jwtService;
        }

        public async Task<LoginDto> Handle(UpdateLoginCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(currentUserService.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            IdentityResult result = await userManager.SetUserNameAsync(user, request.Login);
            Guard.Requires(() => result.Succeeded, new OperationException());

            IEnumerable<Claim> claims = userService.GetLoginClaims(user);
            string token = jwtService.GenerateJwt(claims);

            return new LoginDto { AccessToken = token };
        }
    }
}

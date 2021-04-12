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

namespace Application.UserEmail.Commands.ConfirmEmail
{
    public class ConfirmEmailCommand : IRequest<LoginDto>
    {
        public string Id { get; set; }

        public string Token { get; set; }
    }

    public class ConfirmEmailCommandHandler : IRequestHandler<ConfirmEmailCommand, LoginDto>
    {
        private readonly UserManager<User> userManager;
        private readonly IUserService userService;
        private readonly IJwtService jwtService;

        public ConfirmEmailCommandHandler(UserManager<User> userManager, IUserService userService, IJwtService jwtService)
        {
            this.userManager = userManager;
            this.userService = userService;
            this.jwtService = jwtService;
        }

        public async Task<LoginDto> Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            IdentityResult result = await userManager.ConfirmEmailAsync(user, request.Token);
            Guard.Requires(() => result.Succeeded, new OperationException(400));

            IEnumerable<Claim> claims = await userService.GetLoginClaims(user);
            string token = jwtService.GenerateJwt(claims);

            return new LoginDto() { AccessToken = token };
        }
    }
}

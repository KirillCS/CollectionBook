using Application.Common.Exceptions;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.ResetPassword
{
    public class ResetPasswordCommand : IRequest
    {
        public string Id { get; set; }

        public string Password { get; set; }

        public string PasswordConfirmation { get; set; }

        public string Token { get; set; }
    }

    public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand>
    {
        private readonly UserManager<User> userManager;

        public ResetPasswordCommandHandler(UserManager<User> userManager)
        {
            this.userManager = userManager;
        }

        public async Task<Unit> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            IdentityResult result = await userManager.ResetPasswordAsync(user, request.Token, request.Password);
            Guard.Requires(() => result.Succeeded, new OperationException());

            return Unit.Value;
        }
    }
}

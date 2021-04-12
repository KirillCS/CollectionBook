using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.UpdatePassword
{
    public class UpdatePasswordCommand : IRequest
    {
        public string CurrentPassword { get; set; }

        public string NewPassword { get; set; }

        public string PasswordConfirmation { get; set; }
    }

    public class UpdatePasswordCommandHandler : IRequestHandler<UpdatePasswordCommand>
    {
        private readonly UserManager<User> userManager;
        private readonly ICurrentUserService currentUserService;

        public UpdatePasswordCommandHandler(UserManager<User> userManager, ICurrentUserService currentUserService)
        {
            this.userManager = userManager;
            this.currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(UpdatePasswordCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(currentUserService.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            IdentityResult result = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            Guard.Requires(() => result.Succeeded, new OperationException());

            return Unit.Value;
        }
    }
}

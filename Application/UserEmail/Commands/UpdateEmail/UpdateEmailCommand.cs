using Application.Common.Exceptions;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;

namespace Application.UserEmail.Commands.ConfirmEmailUpdating
{
    public class UpdateEmailCommand : IRequest
    {
        public string Id { get; set; }

        public string Email { get; set; }

        public string Token { get; set; }
    }

    public class UpdateEmailCommandHandler : IRequestHandler<UpdateEmailCommand>
    {
        private readonly UserManager<User> userManager;

        public UpdateEmailHandler(UserManager<User> userManager)
        {
            this.userManager = userManager;
        }

        public async Task<Unit> Handle(UpdateEmailCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            IdentityResult result = await userManager.ChangeEmailAsync(user, request.Email, request.Token);
            Guard.Requires(() => result.Succeeded, new OperationException(400));

            return Unit.Value;
        }
    }
}

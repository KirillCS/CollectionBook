using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.UserEmail.Commands.UpdateEmail
{
    public class UpdateEmailCommand : IRequest
    {
        public string Email { get; set; }
    }

    class UpdateEmailCommandHandler : IRequestHandler<UpdateEmailCommand>
    {
        private readonly IUserService userService;
        private readonly ICurrentUserService currentUserService;
        private readonly IEmailChangingTokenSenderService senderService;

        public UpdateEmailCommandHandler(IUserService userService, ICurrentUserService currentUserService, IEmailChangingTokenSenderService senderService)
        {
            this.userService = userService;
            this.currentUserService = currentUserService;
            this.senderService = senderService;
        }

        public async Task<Unit> Handle(UpdateEmailCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserById(currentUserService.UserId);
            Guard.Requires(() => user is not null, new EntityNotFoundException());
            var token = await userService.GenerateChangeEmailToken(user, request.Email);
            await senderService.Send(user.Id, request.Email, token);

            return Unit.Value;
        }
    }
}

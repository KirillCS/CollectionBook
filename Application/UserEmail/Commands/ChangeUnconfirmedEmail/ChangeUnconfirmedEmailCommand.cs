using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.UserEmail.Commands.ChangeUnconfirmedEmail
{
    public class ChangeUnconfirmedEmailCommand : IRequest
    {
        public string Id { get; set; }

        public string Email { get; set; }
    }

    public class ChangeUnconfirmedEmailCommandHandler : IRequestHandler<ChangeUnconfirmedEmailCommand>
    {
        private readonly IUserService userService;
        private readonly IEmailConfirmationSenderService senderService;

        public ChangeUnconfirmedEmailCommandHandler(IUserService userService, IEmailConfirmationSenderService senderService)
        {
            this.userService = userService;
            this.senderService = senderService;
        }

        public async Task<Unit> Handle(ChangeUnconfirmedEmailCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserById(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());
            await userService.SetEmail(user, request.Email);
            var token = await userService.GenerateEmailConfirmationToken(user);
            await senderService.Send(user.Id, user.Email, token);

            return Unit.Value;
        }
    }
}

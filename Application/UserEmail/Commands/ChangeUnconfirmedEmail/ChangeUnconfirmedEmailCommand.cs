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
        private readonly IUserService1 userService;
        private readonly IEmailMessageService messageService;
        private readonly IEmailSenderService emailSenderService;

        public ChangeUnconfirmedEmailCommandHandler(IUserService1 userService, IEmailMessageService messageService, IEmailSenderService emailSenderService)
        {
            this.userService = userService;
            this.messageService = messageService;
            this.emailSenderService = emailSenderService;
        }

        public async Task<Unit> Handle(ChangeUnconfirmedEmailCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserById(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());
            await userService.SetEmail(user, request.Email);
            var token = await userService.GenerateEmailConfirmationToken(user);
            var message = messageService.GenerateEmailConfirmationMessage(user.Email, user.Id, token);
            await emailSenderService.SendEmail(message);

            return Unit.Value;
        }
    }
}

using Application.Common.Interfaces;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.UserEmail.Commands.SendConfirmationEmail
{
    public class SendConfirmationEmailCommand : IRequest
    {
        public string Id { get; set; }
    }

    public class SendConfirmationEmailCommandHandler : IRequestHandler<SendConfirmationEmailCommand>
    {
        private readonly IIdentityService identityService;
        private readonly IUserService userService;
        private readonly IEmailMessageService messageService;
        private readonly IEmailSenderService emailSenderService;

        public SendConfirmationEmailCommandHandler(IIdentityService identityService, IUserService userService, IEmailMessageService messageService, IEmailSenderService emailSenderService)
        {
            this.identityService = identityService;
            this.userService = userService;
            this.messageService = messageService;
            this.emailSenderService = emailSenderService;
        }

        public async Task<Unit> Handle(SendConfirmationEmailCommand request, CancellationToken cancellationToken)
        {
            var token = await identityService.GenerateEmailConfirmationToken(request.Id);
            var user = await userService.GetById(request.Id);
            var message = messageService.GenerateEmailConfirmationMessage(user.Email, user.Id, token);
            await emailSenderService.SendEmail(message);

            return Unit.Value;
        }
    }
}

using Application.Common.Interfaces;
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
        private readonly IIdentityService identityService;
        private readonly ICurrentUserService currentUserService;
        private readonly IEmailMessageService messageService;
        private readonly IEmailSenderService emailSenderService;

        public UpdateEmailCommandHandler(IIdentityService identityService, ICurrentUserService currentUserService, IEmailMessageService messageService, IEmailSenderService emailSenderService)
        {
            this.identityService = identityService;
            this.currentUserService = currentUserService;
            this.messageService = messageService;
            this.emailSenderService = emailSenderService;
        }

        public async Task<Unit> Handle(UpdateEmailCommand request, CancellationToken cancellationToken)
        {
            var token = await identityService.GenerateEmailChangingToken(currentUserService.UserId, request.Email);
            var messsage = messageService.GenerateEmailChangingMessage(request.Email, currentUserService.UserId, token);
            await emailSenderService.SendEmail(messsage);

            return Unit.Value;
        }
    }
}

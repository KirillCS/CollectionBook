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
        private readonly IIdentityService identityService;
        private readonly IEmailMessageService messageService;
        private readonly IEmailSenderService emailSenderService;

        public ChangeUnconfirmedEmailCommandHandler(IIdentityService identityService, IEmailMessageService messageService, IEmailSenderService emailSenderService)
        {
            this.identityService = identityService;
            this.messageService = messageService;
            this.emailSenderService = emailSenderService;
        }

        public async Task<Unit> Handle(ChangeUnconfirmedEmailCommand request, CancellationToken cancellationToken)
        {
            var result = await identityService.SetEmail(request.Id, request.Email);
            Guard.Requires(() => result.Successed, new OperationException(result.Errors));

            var token = await identityService.GenerateEmailConfirmationToken(request.Id);
            var message = messageService.GenerateEmailConfirmationMessage(request.Email, request.Id, token);
            await emailSenderService.SendEmail(message);

            return Unit.Value;
        }
    }
}

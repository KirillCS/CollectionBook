using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
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
        private readonly IUserService1 userService;
        private readonly IEmailMessageService messageService;
        private readonly IEmailSenderService emailSenderService;

        public SendConfirmationEmailCommandHandler(IUserService1 userService, IEmailMessageService messageService, IEmailSenderService emailSenderService)
        {
            this.userService = userService;
            this.messageService = messageService;
            this.emailSenderService = emailSenderService;
        }

        public async Task<Unit> Handle(SendConfirmationEmailCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserById(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());
            var token = await userService.GenerateEmailConfirmationToken(user);
            var message = messageService.GenerateEmailConfirmationMessage(user.Email, user.Id, token);
            await emailSenderService.SendEmail(message);

            return Unit.Value;
        }
    }
}

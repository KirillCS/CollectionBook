using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using MimeKit;
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
        private readonly UserManager<User> userManager;
        private readonly IEmailMessageService messageService;
        private readonly IEmailSenderService emailSenderService;

        public SendConfirmationEmailCommandHandler(UserManager<User> userManager, IEmailMessageService messageService, IEmailSenderService emailSenderService)
        {
            this.userManager = userManager;
            this.messageService = messageService;
            this.emailSenderService = emailSenderService;
        }

        public async Task<Unit> Handle(SendConfirmationEmailCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            string token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            MimeMessage message = messageService.GenerateEmailConfirmationMessage(user.Email, user.Id, token);
            await emailSenderService.SendEmail(message);

            return Unit.Value;
        }
    }
}

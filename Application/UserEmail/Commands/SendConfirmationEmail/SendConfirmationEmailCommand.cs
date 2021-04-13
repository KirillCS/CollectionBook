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
        private readonly IEmailMessageExtensionsService emailMessageService;
        private readonly IEmailSenderService emailSenderService;

        public SendConfirmationEmailCommandHandler(UserManager<User> userManager, IEmailMessageExtensionsService emailMessageService, IEmailSenderService emailSenderService)
        {
            this.userManager = userManager;
            this.emailMessageService = emailMessageService;
            this.emailSenderService = emailSenderService;
        }

        public async Task<Unit> Handle(SendConfirmationEmailCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            string token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            MimeMessage message = emailMessageService.GenerateEmailConfirmationMessage(user.Email, user.Id, token);
            await emailSenderService.SendEmail(message);

            return Unit.Value;
        }
    }
}

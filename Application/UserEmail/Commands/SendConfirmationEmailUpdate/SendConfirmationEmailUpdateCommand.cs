using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using MimeKit;
using System.Threading;
using System.Threading.Tasks;

namespace Application.UserEmail.Commands.UpdateEmail
{
    public class SendConfirmationEmailUpdateCommand : IRequest
    {
        public string Email { get; set; }
    }

    class SendConfirmationEmailUpdateCommandHandler : IRequestHandler<SendConfirmationEmailUpdateCommand>
    {
        private readonly UserManager<User> userManager;
        private readonly ICurrentUserService currentUserService;
        private readonly IEmailMessageService messageService;
        private readonly IEmailSenderService emailSenderService;

        public SendConfirmationEmailUpdateCommandHandler(UserManager<User> userManager, ICurrentUserService currentUserService, IEmailMessageService messageService, IEmailSenderService emailSenderService)
        {
            this.userManager = userManager;
            this.currentUserService = currentUserService;
            this.messageService = messageService;
            this.emailSenderService = emailSenderService;
        }

        public async Task<Unit> Handle(SendConfirmationEmailUpdateCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(currentUserService.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            string token = await userManager.GenerateChangeEmailTokenAsync(user, request.Email);
            MimeMessage messsage = messageService.GenerateEmailChangingMessage(request.Email, currentUserService.Id, token);
            await emailSenderService.SendEmail(messsage);

            return Unit.Value;
        }
    }
}

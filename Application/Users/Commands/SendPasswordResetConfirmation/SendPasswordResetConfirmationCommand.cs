using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using MimeKit;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.SendPasswordResetConfirmation
{
    public class SendPasswordResetConfirmationCommand: IRequest
    {
        public string Email { get; set; }
    }

    public class SendPasswordResetConfirmationCommandHandler : IRequestHandler<SendPasswordResetConfirmationCommand>
    {
        private readonly UserManager<User> userManager;
        private readonly IEmailMessageService emailMessageService;
        private readonly IEmailSenderService emailSenderService;

        public SendPasswordResetConfirmationCommandHandler(UserManager<User> userManager, IEmailMessageService emailMessageService, IEmailSenderService emailSenderService)
        {
            this.userManager = userManager;
            this.emailMessageService = emailMessageService;
            this.emailSenderService = emailSenderService;
        }

        public async Task<Unit> Handle(SendPasswordResetConfirmationCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByEmailAsync(request.Email);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            string token = await userManager.GeneratePasswordResetTokenAsync(user);
            MimeMessage message = emailMessageService.GeneratePasswordResetMessage(user.Email, user.Id, token);
            await emailSenderService.SendEmail(message);

            return Unit.Value;
        }
    }
}

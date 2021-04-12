using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using MimeKit;
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
        private readonly UserManager<User> userManager;
        private readonly IEmailMessageService messageService;
        private readonly IEmailSenderService emailSenderService;

        public ChangeUnconfirmedEmailCommandHandler(UserManager<User> userManager, IEmailMessageService messageService, IEmailSenderService emailSenderService)
        {
            this.userManager = userManager;
            this.messageService = messageService;
            this.emailSenderService = emailSenderService;
        }

        public async Task<Unit> Handle(ChangeUnconfirmedEmailCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            IdentityResult result = await userManager.SetEmailAsync(user, request.Email);
            Guard.Requires(() => result.Succeeded, new OperationException());

            string token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            MimeMessage message = messageService.GenerateEmailConfirmationMessage(request.Email, request.Id, token);
            await emailSenderService.SendEmail(message);

            return Unit.Value;
        }
    }
}

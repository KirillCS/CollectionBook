using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Common;
using MediatR;
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
        private readonly IUserService userService;
        private readonly IIdentityService identityService;
        private readonly IEmailMessageService emailMessageService;
        private readonly IEmailSenderService emailSenderService;

        public SendPasswordResetConfirmationCommandHandler(IUserService userService, 
                                                           IIdentityService identityService, 
                                                           IEmailMessageService emailMessageService,
                                                           IEmailSenderService emailSenderService)
        {
            this.userService = userService;
            this.identityService = identityService;
            this.emailMessageService = emailMessageService;
            this.emailSenderService = emailSenderService;
        }

        public async Task<Unit> Handle(SendPasswordResetConfirmationCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetByEmail(request.Email);
            Guard.Requires(() => user is not null, new EntityNotFoundException(nameof(UserDto), "email", request.Email));
            var token = await identityService.GeneratePasswordResetToken(user.Id);
            var message = emailMessageService.GeneratePasswordResetMessage(user.Email, user.Id, token);
            await emailSenderService.SendEmail(message);

            return Unit.Value;
        }
    }
}

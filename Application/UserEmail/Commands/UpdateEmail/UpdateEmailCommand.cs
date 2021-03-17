using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
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
        private readonly IUserService userService;
        private readonly ICurrentUserService currentUserService;
        private readonly IEmailMessageService messageService;
        private readonly IEmailSenderService emailSenderService;

        public UpdateEmailCommandHandler(IUserService userService, ICurrentUserService currentUserService, IEmailMessageService messageService, IEmailSenderService emailSenderService)
        {
            this.userService = userService;
            this.currentUserService = currentUserService;
            this.messageService = messageService;
            this.emailSenderService = emailSenderService;
        }

        public async Task<Unit> Handle(UpdateEmailCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserById(currentUserService.UserId);
            Guard.Requires(() => user is not null, new EntityNotFoundException());
            var token = await userService.GenerateChangeEmailToken(user, request.Email);
            var messsage = messageService.GenerateEmailChangingMessage(request.Email, user.Id, token);
            await emailSenderService.SendEmail(messsage);

            return Unit.Value;
        }
    }
}

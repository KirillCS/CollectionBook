using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Email.Commands.SendConfirmationEmail
{
    public class SendConfirmationEmailCommand : IRequest
    {
        public string Id { get; set; }
    }

    public class SendConfirmationEmailCommandHandler : IRequestHandler<SendConfirmationEmailCommand>
    {
        private readonly IUserService userService;
        private readonly IEmailConfirmationSenderService emailService;

        public SendConfirmationEmailCommandHandler(IUserService userService, IEmailConfirmationSenderService emailService)
        {
            this.userService = userService;
            this.emailService = emailService;
        }

        public async Task<Unit> Handle(SendConfirmationEmailCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserById(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            await emailService.SendConfirmation(user);
            return Unit.Value;
        }
    }
}

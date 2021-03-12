using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Email.Commands.UpdateEmail
{
    public class UpdateEmailCommand : IRequest<UpdateEmailResponse>
    {
        public string Id { get; set; }

        public string Email { get; set; }
    }

    public class UpdateEmailCommandHandler : IRequestHandler<UpdateEmailCommand, UpdateEmailResponse>
    {
        private readonly IUserService userService;
        private readonly IEmailConfirmationSenderService senderService;

        public UpdateEmailCommandHandler(IUserService userService, IEmailConfirmationSenderService senderService)
        {
            this.userService = userService;
            this.senderService = senderService;
        }

        public async Task<UpdateEmailResponse> Handle(UpdateEmailCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserById(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            await userService.SetEmail(user, request.Email);
            await senderService.SendConfirmation(user);

            return new UpdateEmailResponse() { NewEmail = user.Email };
        }
    }
}

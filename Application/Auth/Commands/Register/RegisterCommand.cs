using Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Auth.Commands.Register
{
    public class RegisterCommand : IRequest<RegisterResponse>
    {
        public string Login { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string PasswordConfirmation { get; set; }
    }

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterResponse>
    {
        private readonly IIdentityService identityService;
        private readonly IUserService userService;
        private readonly IMapper mapper;
        private readonly IEmailMessageService messageService;
        private readonly IEmailSenderService emailSenderService;

        public RegisterCommandHandler(IIdentityService identityService,
                                      IUserService userService,
                                      IMapper mapper,
                                      IEmailMessageService messageService,
                                      IEmailSenderService emailSenderService)
        {
            this.identityService = identityService;
            this.userService = userService;
            this.mapper = mapper;
            this.messageService = messageService;
            this.emailSenderService = emailSenderService;
        }

        public async Task<RegisterResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var id = await identityService.Create(request.Login, request.Email, request.Password);
            var token = await identityService.GenerateEmailConfirmationToken(id);
            var user = await userService.GetById(id);
            var message = messageService.GenerateEmailConfirmationMessage(user.Email, user.Id, token);
            await emailSenderService.SendEmail(message);

            return mapper.Map<RegisterResponse>(user);
        }
    }
}

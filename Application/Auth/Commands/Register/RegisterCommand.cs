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
        private readonly IUserService userService;
        private readonly IEmailConfirmationUriService uriService;
        private readonly IEmailSenderService emailSender;
        private readonly IMapper mapper;

        public RegisterCommandHandler(IUserService userService,
                                      IEmailConfirmationUriService uriService,
                                      IEmailSenderService emailSender,
                                      IMapper mapper)
        {
            this.userService = userService;
            this.uriService = uriService;
            this.emailSender = emailSender;
            this.mapper = mapper;
        }

        public async Task<RegisterResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.CreateUser(request.Login, request.Email, request.Password);
            var uri = await uriService.Generate(user);
            await emailSender.SendEmail(user.Email, "Email confirmation", $"<h2>CollectionBook</h2><p>To complete your profile and start using \"CollectionBook\" you'll need to verify your email address. <a href=\"{uri}\"><b>Click here!</b></a></p>");

            return mapper.Map<RegisterResponse>(user);
        }
    }
}

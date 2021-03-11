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
        private readonly IEmailConfirmationSenderService emailService;
        private readonly IMapper mapper;

        public RegisterCommandHandler(IUserService userService, IEmailConfirmationSenderService emailService, IMapper mapper)
        {
            this.userService = userService;
            this.emailService = emailService;
            this.mapper = mapper;
        }

        public async Task<RegisterResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.CreateUser(request.Login, request.Email, request.Password);
            await emailService.SendConfirmation(user);

            return mapper.Map<RegisterResponse>(user);
        }
    }
}

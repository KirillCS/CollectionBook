using Application.Common.Dto;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using MimeKit;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Auth.Commands.Register
{
    public class RegisterCommand : IRequest<RegisterDto>
    {
        public string Login { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string PasswordConfirmation { get; set; }
    }

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterDto>
    {
        private readonly IUserService userService;
        private readonly UserManager<User> userManager;
        private readonly IMapper mapper;
        private readonly IEmailMessageExtensionsService emailMessageService;
        private readonly IEmailSenderService emailSenderService;

        public RegisterCommandHandler(IUserService userService,
                                      UserManager<User> userManager,
                                      IMapper mapper,
                                      IEmailMessageExtensionsService emailMessageService,
                                      IEmailSenderService emailSenderService)
        {
            this.userService = userService;
            this.userManager = userManager;
            this.mapper = mapper;
            this.emailMessageService = emailMessageService;
            this.emailSenderService = emailSenderService;
        }

        public async Task<RegisterDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            User user = await userService.Create(request.Login, request.Email, request.Password);
            string token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            MimeMessage message = emailMessageService.GenerateEmailConfirmationMessage(user.Email, user.Id, token);
            await emailSenderService.SendEmail(message);

            return mapper.Map<RegisterDto>(user);
        }
    }
}

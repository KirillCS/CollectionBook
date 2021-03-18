using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.UpdateProfile
{
    public class UpdateProfileCommand : IRequest<UserDto>
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Biography { get; set; }

        public string Location { get; set; }

        public string WebsiteUrl { get; set; }

        public string TelegramLogin { get; set; }

        public string InstagramLogin { get; set; }
    }

    public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, UserDto>
    {
        private readonly ICurrentUserService currentUserService;
        private readonly IUserService userService;

        public UpdateProfileCommandHandler(ICurrentUserService currentUserService, IUserService userService)
        {
            this.currentUserService = currentUserService;
            this.userService = userService;
        }

        public async Task<UserDto> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetById(currentUserService.UserId);
            Guard.Requires(() => user is not null, new IdentityNotFoundException(currentUserService.UserId));
            request.CopyPropertiesTo(user);
            var result = await userService.UpdateProfile(user);
            Guard.Requires(() => result.Successed, new UpdateProfileException(result.Errors));

            return user;
        }
    }
}

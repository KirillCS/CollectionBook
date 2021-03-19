using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.UpdateProfile
{
    public class UpdateProfileCommand : IRequest
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Biography { get; set; }

        public string Location { get; set; }

        public string WebsiteUrl { get; set; }

        public string TelegramLogin { get; set; }

        public string InstagramLogin { get; set; }
    }

    public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand>
    {
        private readonly ICurrentUserService currentUserService;
        private readonly IUserService userService;

        public UpdateProfileCommandHandler(ICurrentUserService currentUserService, IUserService userService)
        {
            this.currentUserService = currentUserService;
            this.userService = userService;
        }

        public async Task<Unit> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        {
            var result = await userService.UpdateProfile(currentUserService.UserId, request);
            Guard.Requires(() => result.Successed, new UpdateProfileException(result.Errors));

            return Unit.Value;
        }
    }
}

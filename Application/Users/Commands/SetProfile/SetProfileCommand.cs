using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Users.Queries.GetProfile;
using AutoMapper;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.SetProfile
{
    public class SetProfileCommand : IRequest<ProfileResponse>
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Biography { get; set; }

        public string Location { get; set; }

        public string WebsiteUrl { get; set; }

        public string TelegramLogin { get; set; }

        public string InstagramLogin { get; set; }
    }

    public class SetProfileCommandHandler : IRequestHandler<SetProfileCommand, ProfileResponse>
    {
        private readonly ICurrentUserService currentUserService;
        private readonly IUserService userService;
        private readonly IMapper mapper;

        public SetProfileCommandHandler(ICurrentUserService currentUserService, IUserService userService, IMapper mapper)
        {
            this.currentUserService = currentUserService;
            this.userService = userService;
            this.mapper = mapper;
        }

        public async Task<ProfileResponse> Handle(SetProfileCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserById(currentUserService.UserId);
            Guard.Requires(() => user is not null, new EntityNotFoundException());
            request.CopyPropertiesTo(user);
            await userService.UpdateUser(user) ;

            return mapper.Map<ProfileResponse>(user);
        }
    }
}

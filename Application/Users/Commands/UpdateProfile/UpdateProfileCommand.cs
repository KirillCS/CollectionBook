using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
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

        public bool IsEmailVisible { get; set; }

        public string WebsiteUrl { get; set; }

        public string TelegramLogin { get; set; }

        public string InstagramLogin { get; set; }
    }

    public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand>
    {
        private readonly UserManager<User> userManager;
        private readonly ICurrentUserService currentUserService;

        public UpdateProfileCommandHandler(UserManager<User> userManager, ICurrentUserService currentUserService)
        {
            this.userManager = userManager;
            this.currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(currentUserService.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            request.CopyPropertiesTo(user);

            IdentityResult result = await userManager.UpdateAsync(user);
            Guard.Requires(() => result.Succeeded, new OperationException());

            return Unit.Value;
        }
    }
}

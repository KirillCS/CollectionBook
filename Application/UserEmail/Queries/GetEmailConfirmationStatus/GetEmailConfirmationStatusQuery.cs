using Application.Common.Exceptions;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;

namespace Application.UserEmail.Queries.GetEmailConfirmationStatus
{
    public class GetEmailConfirmationStatusQuery : IRequest<bool>
    {
        public string Id { get; set; }
    }

    public class GetEmailConfirmationStatusQueryHandler : IRequestHandler<GetEmailConfirmationStatusQuery, bool>
    {
        private readonly UserManager<User> userManager;

        public GetEmailConfirmationStatusQueryHandler(UserManager<User> userManager)
        {
            this.userManager = userManager;
        }

        public async Task<bool> Handle(GetEmailConfirmationStatusQuery request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            return await userManager.IsEmailConfirmedAsync(user);
        }
    }
}

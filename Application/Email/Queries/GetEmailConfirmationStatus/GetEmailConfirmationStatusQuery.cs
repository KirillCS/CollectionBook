using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Email.Queries.GetEmailConfirmationStatus
{
    public class GetEmailConfirmationStatusQuery : IRequest<bool>
    {
        public string Id { get; set; }
    }

    public class GetEmailConfirmationStatusQueryHandler : IRequestHandler<GetEmailConfirmationStatusQuery, bool>
    {
        private readonly IUserService userService;

        public GetEmailConfirmationStatusQueryHandler(IUserService userService)
        {
            this.userService = userService;
        }

        public async Task<bool> Handle(GetEmailConfirmationStatusQuery request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserById(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            return await userService.IsEmailConfirmed(user);
        }
    }
}

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.UserEmail.Commands.ConfirmEmailUpdating
{
    public class ConfirmEmailUpdatingCommand : IRequest
    {
        public string Id { get; set; }

        public string Email { get; set; }

        public string Token { get; set; }
    }

    public class ConfirmEmailUpdatingHandler : IRequestHandler<ConfirmEmailUpdatingCommand>
    {
        private readonly IUserService userService;

        public ConfirmEmailUpdatingHandler(IUserService userService)
        {
            this.userService = userService;
        }

        public async Task<Unit> Handle(ConfirmEmailUpdatingCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserById(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException());
            await userService.ChangeEmail(user, request.Email, request.Token);
            // throw exception if email changing was failed

            return Unit.Value;
        }
    }
}

using Application.Common.Attributes;
using Application.Common.Exceptions;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Administration.Commands.ChangeUserBlockStatus
{
    [Authorize(new[] { Roles.Admin, Roles.Owner })]
    public class ChangeUserBlockStatusCommand : IRequest
    {
        public string Id { get; init; }

        public bool NewBlockStatus { get; init; }

        public string BlockReason { get; init; }
    }

    public class ChangeUserBlockStatusCommandHandler : IRequestHandler<ChangeUserBlockStatusCommand>
    {
        private readonly UserManager<User> userManager;

        public ChangeUserBlockStatusCommandHandler(UserManager<User> userManager)
        {
            this.userManager = userManager;
        }

        public async Task<Unit> Handle(ChangeUserBlockStatusCommand request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByIdAsync(request.Id);
            Guard.Requires(() => user is not null, new EntityNotFoundException(nameof(User)));
            Guard.Requires(() => user.IsBlocked != request.NewBlockStatus, new OperationException(406));

            user.IsBlocked = request.NewBlockStatus;
            user.BlockReason = request.NewBlockStatus ? request.BlockReason : null;

            await userManager.UpdateAsync(user);

            return Unit.Value;
        }
    }
}

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
        private readonly IIdentityService identityService;

        public ConfirmEmailUpdatingHandler(IIdentityService identityService)
        {
            this.identityService = identityService;
        }

        public async Task<Unit> Handle(ConfirmEmailUpdatingCommand request, CancellationToken cancellationToken)
        {
            var result = await identityService.ChangeEmail(request.Id, request.Email, request.Token);
            Guard.Requires(() => result.Successed, new OperationException(result.Errors, 400));

            return Unit.Value;
        }
    }
}

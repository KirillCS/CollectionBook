using Application.Common.Interfaces;
using MediatR;
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
        private readonly IIdentityService identityService;

        public GetEmailConfirmationStatusQueryHandler(IIdentityService identityService)
        {
            this.identityService = identityService;
        }

        public async Task<bool> Handle(GetEmailConfirmationStatusQuery request, CancellationToken cancellationToken)
        {
            return await identityService.IsEmailConfirmed(request.Id);
        }
    }
}

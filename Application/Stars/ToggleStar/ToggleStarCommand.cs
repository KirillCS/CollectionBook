using Application.Common.Attributes;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Stars.ToggleStar
{
    [Authorize(new[] { Roles.User, Roles.Admin })]
    public class ToggleStarCommand : IRequest
    {
        public int CollectionId { get; init; }
    }

    public class ToggleStarCommandCommandHandler : IRequestHandler<ToggleStarCommand>
    {
        private readonly IApplicationDbContext dbContext;
        private readonly ICurrentUserService currentUserService;

        public ToggleStarCommandCommandHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
        {
            this.dbContext = dbContext;
            this.currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(ToggleStarCommand request, CancellationToken cancellationToken)
        {
            Collection collection = dbContext.Collections.FirstOrDefault(c => c.Id == request.CollectionId);
            Guard.Requires(() => collection is not null, new EntityNotFoundException());

            string userId = currentUserService.Id;
            Star star = dbContext.Stars.FirstOrDefault(s => s.UserId == userId && s.CollectionId == request.CollectionId);

            if (star is null)
            {
                await dbContext.Stars.AddAsync(new Star { UserId = currentUserService.Id, CollectionId = request.CollectionId }, cancellationToken);
            }
            else
            {
                dbContext.Stars.Remove(star);
            }

            await dbContext.SaveChanges(cancellationToken);

            return Unit.Value;
        }
    }
}

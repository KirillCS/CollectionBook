using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Collections.Commands.StarCollection
{
    public class StarCollectionCommand : IRequest
    {
        public int Id { get; set; }
    }

    public class StarCollectionCommandHandler : IRequestHandler<StarCollectionCommand>
    {
        private readonly IApplicationDbContext dbContext;
        private readonly ICurrentUserService currentUserService;

        public StarCollectionCommandHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
        {
            this.dbContext = dbContext;
            this.currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(StarCollectionCommand request, CancellationToken cancellationToken)
        {
            Collection collection = dbContext.Collections.FirstOrDefault(c => c.Id == request.Id);
            Guard.Requires(() => collection is not null, new EntityNotFoundException());

            string userId = currentUserService.UserId;
            Star star = dbContext.Stars.FirstOrDefault(s => s.UserId == userId && s.CollectionId == request.Id);

            if (star is null)
            {
                await dbContext.Stars.AddAsync(new Star { UserId = currentUserService.UserId, CollectionId = request.Id }, cancellationToken);
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

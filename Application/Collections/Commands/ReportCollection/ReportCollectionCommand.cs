using Application.Common.Attributes;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Collections.Commands.ReportCollection
{
    [Authorize(new[] { Roles.User })]
    public class ReportCollectionCommand : IRequest
    {
        public int Id { get; init; }

        public string ReportDescription { get; init; }
    }

    public class ReportCollectionCommandHandler : IRequestHandler<ReportCollectionCommand>
    {
        private readonly IApplicationDbContext context;
        private readonly ICurrentUserService currentUserService;

        public ReportCollectionCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            this.context = context;
            this.currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(ReportCollectionCommand request, CancellationToken cancellationToken)
        {
            Collection collection = await context.Collections.FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);
            Guard.Requires(() => collection is not null, new EntityNotFoundException(nameof(Collection)));

            var report = new Report()
            {
                Description = request.ReportDescription,
                UserId = currentUserService.Id
            };

            collection.Reports.Add(report);
            await context.SaveChanges(cancellationToken);

            return Unit.Value;
        }
    }
}

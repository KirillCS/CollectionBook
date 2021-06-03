using Application.Common.Attributes;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Administration.Commands.DeleteReport
{
    [Authorize(new[] { Roles.Admin, Roles.Owner })]
    public class DeleteReportCommand : IRequest
    {
        public int Id { get; init; }
    }

    public class DeleteReportCommandHandler : IRequestHandler<DeleteReportCommand>
    {
        private readonly IApplicationDbContext context;

        public DeleteReportCommandHandler(IApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<Unit> Handle(DeleteReportCommand request, CancellationToken cancellationToken)
        {
            Report report = await context.Reports.FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);
            if (report is not null)
            {
                context.Reports.Remove(report);
                await context.SaveChanges(cancellationToken);
            }

            return Unit.Value;
        }
    }
}

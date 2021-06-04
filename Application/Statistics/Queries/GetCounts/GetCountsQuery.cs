using Application.Common.Interfaces;
using Application.Common.Responses;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Statistics.Queries.GetCounts
{
    public class GetCountsQuery : IRequest<CountsResponse>
    {
    }

    public class GetCountsQueryHandler : IRequestHandler<GetCountsQuery, CountsResponse>
    {
        private readonly IApplicationDbContext context;

        public GetCountsQueryHandler(IApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<CountsResponse> Handle(GetCountsQuery request, CancellationToken cancellationToken) =>
            new CountsResponse()
            {
                UsersCount = await context.Users.CountAsync(u => u.EmailConfirmed, cancellationToken),
                CollectionsCount = await context.Collections.CountAsync(cancellationToken),
                ItemsCount = await context.Items.CountAsync(cancellationToken)
            };
    }
}

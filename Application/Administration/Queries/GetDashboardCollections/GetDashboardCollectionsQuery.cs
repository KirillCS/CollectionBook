using Application.Common.Attributes;
using Application.Common.Dto;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Common;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Administration.Queries.GetDashboardCollections
{
    [Authorize(new[] { Roles.Admin, Roles.Owner })]
    public class GetDashboardCollectionsQuery : SearchPaginatedListQuery, IRequest<PaginatedList<DashboardCollectionDto>>
    {
    }

    public class GetDashboardCollectionsQueryHandler : IRequestHandler<GetDashboardCollectionsQuery, PaginatedList<DashboardCollectionDto>>
    {
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public GetDashboardCollectionsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<PaginatedList<DashboardCollectionDto>> Handle(GetDashboardCollectionsQuery request, CancellationToken cancellationToken) =>
            int.TryParse(request.SearchString, out int id) switch
            {
                true => await context.Collections.Where(c => c.Name.Contains(request.SearchString) || c.Id == id)
                                                 .OrderByDescending(c => c.Id)
                                                 .OrderByDescending(c => c.Id == id)
                                                 .ProjectTo<DashboardCollectionDto>(mapper.ConfigurationProvider)
                                                 .ToPaginatedList(request.PageIndex, request.PageSize),

                _ => await context.Collections.Where(c => c.Name.Contains(request.SearchString))
                                              .OrderByDescending(c => c.Id)
                                              .ProjectTo<DashboardCollectionDto>(mapper.ConfigurationProvider)
                                              .ToPaginatedList(request.PageIndex, request.PageSize)
            };
    }
}

using Application.Common.Attributes;
using Application.Common.Dto;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Common;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Administration.Queries.GetDashboardReports
{
    [Authorize(new[] { Roles.Admin, Roles.Owner })]
    public class GetDashboardReportsQuery : PaginatedListQuery, IRequest<PaginatedList<DashboardReportDto>>
    {
        public DateTime? From { get; init; }

        public DateTime? To { get; init; }
    }

    public class GetDashboardReportsQueryHandler : IRequestHandler<GetDashboardReportsQuery, PaginatedList<DashboardReportDto>>
    {
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public GetDashboardReportsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<PaginatedList<DashboardReportDto>> Handle(GetDashboardReportsQuery request, CancellationToken cancellationToken)
        {
            DateTime from = request.From ?? default;
            DateTime to = request.To ?? DateTime.Now;

            return await context.Reports.Where(r => r.CreationTime >= from && r.CreationTime <= to)
                                        .ProjectTo<DashboardReportDto>(mapper.ConfigurationProvider)
                                        .ToPaginatedList(request.PageIndex, request.PageSize);
        }
    }
}

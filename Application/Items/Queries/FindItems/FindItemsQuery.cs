using Application.Common.Dto;
using Application.Common.Enums;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Items.Queries.FindItems
{
    public class FindItemsQuery : SearchPaginatedListQuery, IRequest<PaginatedList<ItemCoverDto>>
    {
        public SearchCriterion SearchCriterion { get; init; }

        public ItemsSortCriterion SortCriterion { get; init; }
    }

    public class FindItemsQueryHandler : IRequestHandler<FindItemsQuery, PaginatedList<ItemCoverDto>>
    {
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public FindItemsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<PaginatedList<ItemCoverDto>> Handle(FindItemsQuery request, CancellationToken cancellationToken) =>
            await context.Items
                         .FilterItems(request.SearchCriterion, request.SearchString)
                         .SortBy(request.SortCriterion)
                         .ProjectTo<ItemCoverDto>(mapper.ConfigurationProvider)
                         .ToPaginatedList(request.PageIndex, request.PageSize);
    }

    internal static class QueryableExtensions
    {
        public static IQueryable<Item> FilterItems(this DbSet<Item> source, SearchCriterion criterion, string searchString) =>
            criterion switch
            {
                SearchCriterion.Name => source.Where(c => c.Name.Contains(searchString)),
                SearchCriterion.Tags => source.Where(c => c.Tags.Any(t => t.Label.ToLower() == searchString.ToLower())),
                SearchCriterion.All => source.Where(c => c.Name.Contains(searchString) || c.Tags.Any(t => t.Label.ToLower() == searchString.ToLower())),
                _ => throw new NotImplementedException($"Method {nameof(FilterItems)} don't have an implementation for the {criterion} of the {nameof(SearchCriterion)} enum")
            };
    }
}

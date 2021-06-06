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

namespace Application.Collections.Queries.FindCollections
{
    public class FindCollectionsQuery : SearchPaginatedListQuery, IRequest<PaginatedList<CollectionDto>>
    {
        public SearchCriterion SearchCriterion { get; init; }

        public CollectionsSortCriterion SortCriterion { get; init; }
    }

    public class FindCollectionsQueryHandler : IRequestHandler<FindCollectionsQuery, PaginatedList<CollectionDto>>
    {
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public FindCollectionsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<PaginatedList<CollectionDto>> Handle(FindCollectionsQuery request, CancellationToken cancellationToken) =>
            await context.Collections
                         .FilterCollections(request.SearchCriterion, request.SearchString)
                         .SortBy(request.SortCriterion)
                         .ProjectTo<CollectionDto>(mapper.ConfigurationProvider)
                         .ToPaginatedList(request.PageIndex, request.PageSize);
    }

    internal static class QueryableExtensions
    {
        public static IQueryable<Collection> FilterCollections(this DbSet<Collection> source, SearchCriterion criterion, string searchString) =>
            criterion switch
            {
                SearchCriterion.Name => source.Where(c => c.Name.Contains(searchString)),
                SearchCriterion.Tags => source.Where(c => c.Tags.Any(t => t.Label.ToLower() == searchString.ToLower())),
                SearchCriterion.All => source.Where(c => c.Name.Contains(searchString) || c.Tags.Any(t => t.Label.ToLower() == searchString.ToLower())),
                _ => throw new NotImplementedException($"Method {nameof(FilterCollections)} don't have an implementation for the {criterion} of the {nameof(SearchCriterion)} enum")
            };
    }
}

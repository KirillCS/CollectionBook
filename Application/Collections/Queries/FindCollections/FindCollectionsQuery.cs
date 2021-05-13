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

        public CollectionSortCriterion SortCriterion { get; init; }

        public RangeValue<int> ItemsCount { get; init; }

        public RangeValue<int> StarsCount { get; init; }

        public ParameterExistence CoverExistence { get; init; }
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
                         .FilterCollections(request)
                         .SortBy(request.SortCriterion)
                         .ProjectTo<CollectionDto>(mapper.ConfigurationProvider)
                         .ToPaginatedList(request.PageIndex, request.PageSize);
    }

    internal static class QueryableExtensions
    {
        public static IQueryable<Collection> FilterCollections(this DbSet<Collection> source, FindCollectionsQuery request) =>
            request.SearchCriterion switch
            {
                SearchCriterion.Name => request.CoverExistence switch
                {
                    ParameterExistence.Required => source.Where(c => c.Name.Contains(request.SearchString)
                                                                     && c.Items.Count >= request.ItemsCount.From && c.Items.Count <= request.ItemsCount.To
                                                                     && c.Stars.Count >= request.StarsCount.From && c.Stars.Count <= request.StarsCount.To
                                                                     && c.CoverPath != null),

                    ParameterExistence.NotRequired => source.Where(c => c.Name.Contains(request.SearchString)
                                                                        && c.Items.Count >= request.ItemsCount.From && c.Items.Count <= request.ItemsCount.To
                                                                        && c.Stars.Count >= request.StarsCount.From && c.Stars.Count <= request.StarsCount.To
                                                                        && c.CoverPath == null),

                    ParameterExistence.NoDefference => source.Where(c => c.Name.Contains(request.SearchString)
                                                                         && c.Items.Count >= request.ItemsCount.From && c.Items.Count <= request.ItemsCount.To
                                                                         && c.Stars.Count >= request.StarsCount.From && c.Stars.Count <= request.StarsCount.To),

                    _ => throw new NotImplementedException($"Method {nameof(FilterCollections)} don't have an implementation for the {request.CoverExistence} of the {nameof(ParameterExistence)} enum")
                },

                SearchCriterion.Tags => request.CoverExistence switch
                {
                    ParameterExistence.Required => source.Where(c => c.Tags.Any(t => t.Label.ToLower() == request.SearchString.ToLower())
                                                                     && c.Items.Count >= request.ItemsCount.From && c.Items.Count <= request.ItemsCount.To
                                                                     && c.Stars.Count >= request.StarsCount.From && c.Stars.Count <= request.StarsCount.To
                                                                     && c.CoverPath != null),

                    ParameterExistence.NotRequired => source.Where(c => c.Tags.Any(t => t.Label.ToLower() == request.SearchString.ToLower())
                                                                        && c.Items.Count >= request.ItemsCount.From && c.Items.Count <= request.ItemsCount.To
                                                                        && c.Stars.Count >= request.StarsCount.From && c.Stars.Count <= request.StarsCount.To
                                                                        && c.CoverPath == null),

                    ParameterExistence.NoDefference => source.Where(c => c.Tags.Any(t => t.Label.ToLower() == request.SearchString.ToLower())
                                           && c.Items.Count >= request.ItemsCount.From && c.Items.Count <= request.ItemsCount.To
                                           && c.Stars.Count >= request.StarsCount.From && c.Stars.Count <= request.StarsCount.To),

                    _ => throw new NotImplementedException($"Method {nameof(FilterCollections)} don't have an implementation for the {request.CoverExistence} of the {nameof(ParameterExistence)} enum")
                },

                SearchCriterion.All => request.CoverExistence switch
                {
                    ParameterExistence.Required => source.Where(c => (c.Name.Contains(request.SearchString) || c.Tags.Any(t => t.Label.ToLower() == request.SearchString.ToLower()))
                                                                     && c.Items.Count >= request.ItemsCount.From && c.Items.Count <= request.ItemsCount.To
                                                                     && c.Stars.Count >= request.StarsCount.From && c.Stars.Count <= request.StarsCount.To
                                                                     && c.CoverPath != null),

                    ParameterExistence.NotRequired => source.Where(c => (c.Name.Contains(request.SearchString) || c.Tags.Any(t => t.Label.ToLower() == request.SearchString.ToLower()))
                                                                        && c.Items.Count >= request.ItemsCount.From && c.Items.Count <= request.ItemsCount.To
                                                                        && c.Stars.Count >= request.StarsCount.From && c.Stars.Count <= request.StarsCount.To
                                                                        && c.CoverPath == null),

                    ParameterExistence.NoDefference => source.Where(c => (c.Name.Contains(request.SearchString) || c.Tags.Any(t => t.Label.ToLower() == request.SearchString.ToLower()))
                                                                         && c.Items.Count >= request.ItemsCount.From && c.Items.Count <= request.ItemsCount.To
                                                                         && c.Stars.Count >= request.StarsCount.From && c.Stars.Count <= request.StarsCount.To),

                    _ => throw new NotImplementedException($"Method {nameof(FilterCollections)} don't have an implementation for the {request.CoverExistence} of the {nameof(ParameterExistence)} enum")
                },

                _ => throw new NotImplementedException($"Method {nameof(FilterCollections)} don't have an implementation for the {request.SearchCriterion} of the {nameof(SearchCriterion)} enum")
            };
    }
}

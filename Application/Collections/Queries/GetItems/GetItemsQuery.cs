﻿using Application.Common.Dto;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Collections.Queries.GetItems
{
    public class GetItemsQuery : SearchPaginatedListQuery, IRequest<PaginatedList<ItemCoverDto>>
    {
        public int CollectionId { get; set; }
    }

    public class GetItemsQueryHandler : IRequestHandler<GetItemsQuery, PaginatedList<ItemCoverDto>>
    {
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public GetItemsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<PaginatedList<ItemCoverDto>> Handle(GetItemsQuery request, CancellationToken cancellationToken)
        {
            Collection collection = await context.Collections.FindAsync(request.CollectionId);
            Guard.Requires(() => collection is not null, new EntityNotFoundException());

            //var items = await context.Items.Include(i => i.Images)
            //                          .Where(i => i.CollectionId == request.CollectionId && i.Name.Contains(request.SearchString))
            //                          .OrderByDescending(i => i.CreationTime)
            //                          .ToPaginatedList(request.PageIndex, request.PageSize);

            return await context.Items.Include(i => i.Images)
                                      .Where(i => i.CollectionId == request.CollectionId && i.Name.Contains(request.SearchString))
                                      .OrderByDescending(i => i.CreationTime)
                                      .ProjectTo<ItemCoverDto>(mapper.ConfigurationProvider)
                                      .ToPaginatedList(request.PageIndex, request.PageSize);
        }
    }
}
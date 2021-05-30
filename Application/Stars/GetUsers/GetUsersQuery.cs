using Application.Common.Dto;
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

namespace Application.Stars.GetUsers
{
    public class GetUsersQuery : SearchPaginatedListQuery, IRequest<PaginatedList<UserCoverDto>>
    {
        public int CollectionId { get; init; }
    }

    public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, PaginatedList<UserCoverDto>>
    {
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public GetUsersQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<PaginatedList<UserCoverDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        {
            Collection collection = await context.Collections.FirstOrDefaultAsync(c => c.Id == request.CollectionId, cancellationToken);
            Guard.Requires(() => collection is not null, new EntityNotFoundException());

            string searchString = request.SearchString.ToLowerInvariant();
            return await context.Stars.Include(s => s.User)
                                      .Where(s => s.CollectionId == request.CollectionId && s.User.UserName.ToLower().StartsWith(searchString))
                                      .OrderByDescending(s => s.Id)
                                      .Select(s => s.User)
                                      .ProjectTo<UserCoverDto>(mapper.ConfigurationProvider)
                                      .ToPaginatedList(request.PageIndex, request.PageSize);
        }
    }
}

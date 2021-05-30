using Application.Common.Dto;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Queries.FindUsers
{
    public class FindUsersQuery : SearchPaginatedListQuery, IRequest<PaginatedList<UserCardDto>>
    {
        public UsersSortCriterion SortCriterion { get; init; }
    }

    public class FindUsersQueryHandler : IRequestHandler<FindUsersQuery, PaginatedList<UserCardDto>>
    {
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public FindUsersQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<PaginatedList<UserCardDto>> Handle(FindUsersQuery request, CancellationToken cancellationToken) =>
            await context.Users
                         .Where(u => u.EmailConfirmed && u.UserName.Contains(request.SearchString))
                         .SortBy(request.SortCriterion)
                         .ProjectTo<UserCardDto>(mapper.ConfigurationProvider)
                         .ToPaginatedList(request.PageIndex, request.PageSize);
    }
}

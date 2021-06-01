using Application.Common.Attributes;
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
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Administration.Queries.GetDashboardUsers
{
    [Authorize(new[] { Roles.Admin, Roles.Owner })]
    public class GetDashboardUsersQuery : SearchPaginatedListQuery, IRequest<PaginatedList<DashboardUserDto>>
    {
    }

    public class GetDashboardUsersQueryHandler : IRequestHandler<GetDashboardUsersQuery, PaginatedList<DashboardUserDto>>
    {
        private readonly ICurrentUserService currentUserService;
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public GetDashboardUsersQueryHandler(ICurrentUserService currentUserService, IApplicationDbContext context, IMapper mapper)
        {
            this.currentUserService = currentUserService;
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<PaginatedList<DashboardUserDto>> Handle(GetDashboardUsersQuery request, CancellationToken cancellationToken)
        {
            User currentUser = context.Users.Include(u => u.Role).FirstOrDefault(u => u.Id == currentUserService.Id);
            Guard.Requires(() => currentUser is not null, new EntityNotFoundException(nameof(User)));

            Expression<Func<User, bool>> filter = GetFilter(currentUser.Role, request.SearchString.ToLower());

            return await context.Users.Where(filter).ProjectTo<DashboardUserDto>(mapper.ConfigurationProvider).ToPaginatedList(request.PageIndex, request.PageSize);
        }

        private static Expression<Func<User, bool>> GetFilter(Role currentUserRole, string searchString) =>
            currentUserRole.Name switch
            {
                Roles.Owner => (User u) => u.Role.Name != Roles.Owner && (u.UserName.ToLower().StartsWith(searchString) || u.Id == searchString),
                Roles.Admin => (User u) => u.Role.Name != Roles.Owner && u.Role.Name != Roles.Admin && (u.UserName.ToLower().StartsWith(searchString) || u.Id == searchString),
                _ => throw new OperationException()
            };
    }
}

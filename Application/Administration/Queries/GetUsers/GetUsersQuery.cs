using Application.Common.Dto;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Administration.Queries.GetUsers
{
    public class GetUsersQuery : SearchPaginatedListQuery, IRequest<IEnumerable<object>>
    {
    }

    public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, IEnumerable<object>>
    {
        private readonly ICurrentUserService currentUserService;
        private readonly IApplicationDbContext context;

        public GetUsersQueryHandler(ICurrentUserService currentUserService, IApplicationDbContext context)
        {
            this.currentUserService = currentUserService;
            this.context = context;
        }

        public async Task<IEnumerable<object>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        {
            return null; // context.Users.GroupJoin(userRoles, u => u.Id, ur => ur.UserId, (u, ur) => new { User = u, UserRoles = ur });
        }
    }
}

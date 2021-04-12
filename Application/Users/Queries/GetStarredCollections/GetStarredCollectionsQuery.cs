using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Common;
using Domain.Entities;
using MediatR;
using System;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Queries.GetStarredCollections
{
    public class GetStarredCollectionsQuery : IRequest<PaginatedList<CollectionDto>>
    {
        private string searchString = string.Empty;

        public string Login { get; set; }

        public string SearchString
        {
            get => searchString;
            set
            {
                searchString = value ?? string.Empty;
            }
        }

        public int PageSize { get; set; }

        public int PageIndex { get; set; }
    }

    public class GetStarredCollectionsQueryHandler : IRequestHandler<GetStarredCollectionsQuery, PaginatedList<CollectionDto>>
    {
        private readonly IUserService userService;
        private readonly IApplicationDbContext dbContext;

        public GetStarredCollectionsQueryHandler(IUserService userService, IApplicationDbContext dbContext)
        {
            this.userService = userService;
        }

        public async Task<PaginatedList<CollectionDto>> Handle(GetStarredCollectionsQuery request, CancellationToken cancellationToken)
        {
            UserDto user = await userService.GetByLogin(request.Login);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            IQueryable<Collection> collections = dbContext.Stars.Where(s => s.UserId == user.Id).Select(s => s.Collection);

            return null;
        }
    }
}

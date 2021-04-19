using Application.Common.Dto;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Queries.GetStarredCollections
{
    public class GetStarredCollectionsQuery : SearchPaginatedListQuery, IRequest<PaginatedList<CollectionDto>>
    {
        public string Login { get; set; }
    }

    public class GetStarredCollectionsQueryHandler : IRequestHandler<GetStarredCollectionsQuery, PaginatedList<CollectionDto>>
    {
        private readonly UserManager<User> userManager;
        private readonly IApplicationDbContext dbContext;
        private readonly IMapper mapper;

        public GetStarredCollectionsQueryHandler(UserManager<User> userManager, IApplicationDbContext dbContext, IMapper mapper)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        public async Task<PaginatedList<CollectionDto>> Handle(GetStarredCollectionsQuery request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByNameAsync(request.Login);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            return await dbContext.Collections
                                  .Include(c => c.User)
                                  .Include(c => c.Stars)
                                  .Include(c => c.Tags)
                                  .Where(c => c.Stars.Any(s => s.UserId == user.Id) && c.Name.Contains(request.SearchString))
                                  .OrderByDescending(c => c.CreationTime)
                                  .ProjectTo<CollectionDto>(mapper.ConfigurationProvider)
                                  .ToPaginatedList(request.PageIndex, request.PageSize);
        }
    }
}

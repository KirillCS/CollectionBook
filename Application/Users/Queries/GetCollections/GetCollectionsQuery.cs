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

namespace Application.Users.Queries.GetCollections
{
    public class GetCollectionsQuery : SearchPaginatedListQuery, IRequest<PaginatedList<UserCollectionDto>>
    {
        public string Login { get; set; }
    }

    public class GetCollectionsQueryHandler : IRequestHandler<GetCollectionsQuery, PaginatedList<UserCollectionDto>>
    {
        private readonly UserManager<User> userManager;
        private readonly IApplicationDbContext dbContext;
        private readonly IMapper mapper;

        public GetCollectionsQueryHandler(UserManager<User> userManager, IApplicationDbContext dbContext, IMapper mapper)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        public async Task<PaginatedList<UserCollectionDto>> Handle(GetCollectionsQuery request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByNameAsync(request.Login);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            return await dbContext.Collections
                                  .Include(c => c.Tags)
                                  .Include(c => c.Stars)
                                  .Where(c => c.UserId == user.Id && c.Name.Contains(request.SearchString))
                                  .OrderByDescending(c => c.CreationTime)
                                  .ProjectTo<UserCollectionDto>(mapper.ConfigurationProvider)
                                  .ToPaginatedList(request.PageIndex, request.PageSize);
        }
    }
}

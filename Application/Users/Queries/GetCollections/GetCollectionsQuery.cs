using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Queries.GetCollections
{
    public class GetCollectionsQuery : IRequest<PaginatedList<UserCollectionDto>>
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

    public class GetCollectionsQueryHandler : IRequestHandler<GetCollectionsQuery, PaginatedList<UserCollectionDto>>
    {
        private readonly IApplicationDbContext dbContext;
        private readonly IUserService userService;
        private readonly IMapper mapper;

        public GetCollectionsQueryHandler(IApplicationDbContext dbContext, IUserService userService, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.userService = userService;
            this.mapper = mapper;
        }

        public async Task<PaginatedList<UserCollectionDto>> Handle(GetCollectionsQuery request, CancellationToken cancellationToken)
        {
            UserDto user = await userService.GetByLogin(request.Login);
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

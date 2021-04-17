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
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Queries.GetCollectionsNames
{
    public class GetCollectionsNamesQuery : PaginatedListQuery, IRequest<PaginatedList<CollectionNameDto>>
    {
        public string Login { get; set; }
    }

    public class GetCollectionsNamesQueryHandler : IRequestHandler<GetCollectionsNamesQuery, PaginatedList<CollectionNameDto>>
    {
        private readonly UserManager<User> userManager;
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public GetCollectionsNamesQueryHandler(UserManager<User> userManager, IApplicationDbContext context, IMapper mapper)
        {
            this.userManager = userManager;
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<PaginatedList<CollectionNameDto>> Handle(GetCollectionsNamesQuery request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByNameAsync(request.Login);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            return await context.Collections.Where(c => c.UserId == user.Id && c.Name.Contains(request.SearchString))
                                            .OrderByDescending(c => c.Id)
                                            .ProjectTo<CollectionNameDto>(mapper.ConfigurationProvider)
                                            .ToPaginatedList(request.PageIndex, request.PageSize);
        }
    }
}

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

namespace Application.Users.Queries.GetStarsNotifications
{
    public class GetStarsNotificationsQuery : PaginatedListQuery, IRequest<PaginatedList<StarNotificationDto>>
    {
        public string Login { get; set; }
    }

    public class GetStarsNotificationsQueryHandler : IRequestHandler<GetStarsNotificationsQuery, PaginatedList<StarNotificationDto>>
    {
        private readonly UserManager<User> userManager;
        private readonly IApplicationDbContext context;
        private readonly IMapper mapper;

        public GetStarsNotificationsQueryHandler(UserManager<User> userManager, IApplicationDbContext context, IMapper mapper)
        {
            this.userManager = userManager;
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<PaginatedList<StarNotificationDto>> Handle(GetStarsNotificationsQuery request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByNameAsync(request.Login);
            Guard.Requires(() => user is not null, new EntityNotFoundException());

            return await context.Stars.Include(s => s.User)
                                      .Include(s => s.Collection)
                                      .ThenInclude(c => c.Stars)
                                      .Where(s => s.Collection.UserId == user.Id)
                                      .OrderByDescending(s => s.Id)
                                      .ProjectTo<StarNotificationDto>(mapper.ConfigurationProvider)
                                      .ToPaginatedList(request.PageIndex, request.PageSize);
        }
    }
}

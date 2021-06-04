using Application.Common.Dto;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Queries.GetUser
{
    public class GetUserQuery : IRequest<UserDto>
    {
        public string Login { get; set; }
    }

    public class GetUserQueryHandler : IRequestHandler<GetUserQuery, UserDto>
    {
        private readonly UserManager<User> userManager;
        private readonly IUserService userService;
        private readonly IMapper mapper;

        public GetUserQueryHandler(UserManager<User> userManager, IUserService userService, IMapper mapper)
        {
            this.userManager = userManager;
            this.userService = userService;
            this.mapper = mapper;
        }

        public async Task<UserDto> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByNameAsync(request.Login);
            Guard.Requires(() => user is not null && !userService.IsUserInRole(user, Roles.Owner) && user.EmailConfirmed, new EntityNotFoundException());

            return mapper.Map<UserDto>(user);
        }
    }
}

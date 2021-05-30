using Application.Common.Dto;
using Application.Common.Exceptions;
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
        private readonly IMapper mapper;

        public GetUserQueryHandler(UserManager<User> userManager, IMapper mapper)
        {
            this.userManager = userManager;
            this.mapper = mapper;
        }

        public async Task<UserDto> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            User user = await userManager.FindByNameAsync(request.Login);
            await Guard.RequiresAsync(async () => user is not null && !await userManager.IsInRoleAsync(user, Roles.Owner), new EntityNotFoundException());

            return mapper.Map<UserDto>(user);
        }
    }
}

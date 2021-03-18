using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using MediatR;
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
        private readonly IUserService1 userService;
        private readonly IMapper mapper;

        public GetUserQueryHandler(IUserService1 userService, IMapper mapper)
        {
            this.userService = userService;
            this.mapper = mapper;
        }

        public async Task<UserDto> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserByUserName(request.Login);
            Guard.Requires(() => user is not null, new EntityNotFoundException(nameof(User), "login", request.Login));

            return mapper.Map<UserDto>(user);
        }
    }
}

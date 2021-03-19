using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Common;
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
        private readonly IUserService userService;

        public GetUserQueryHandler(IUserService userService)
        {
            this.userService = userService;
        }

        public async Task<UserDto> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var user = await userService.GetByLogin(request.Login);
            Guard.Requires(() => user is not null, new EntityNotFoundException(nameof(UserDto), "login", request.Login));

            return user;
        }
    }
}

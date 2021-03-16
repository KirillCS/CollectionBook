using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.UpdateLogin
{
    public class UpdateLoginCommand: IRequest<UserDto>
    {
        public string Login { get; set; }
    }

    public class UpdateLoginCommandHandler : IRequestHandler<UpdateLoginCommand, UserDto>
    {
        private readonly IUserService userService;
        private readonly ICurrentUserService currentUserService;
        private readonly IMapper mapper;

        public UpdateLoginCommandHandler(IUserService userService, ICurrentUserService currentUserService, IMapper mapper)
        {
            this.userService = userService;
            this.currentUserService = currentUserService;
            this.mapper = mapper;
        }

        public async Task<UserDto> Handle(UpdateLoginCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserById(currentUserService.UserId);
            Guard.Requires(() => user is not null, new EntityNotFoundException());
            await userService.SetUserName(user, request.Login);

            return mapper.Map<UserDto>(user);
        }
    }
}

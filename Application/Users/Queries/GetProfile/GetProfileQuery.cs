using Application.Common.Exceptions;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Queries.GetProfile
{
    public class GetProfileQuery : IRequest<ProfileResponse>
    {
        public string Login { get; set; }
    }

    public class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, ProfileResponse>
    {
        private readonly IUserService userService;
        private readonly IMapper mapper;

        public GetProfileQueryHandler(IUserService userService, IMapper mapper)
        {
            this.userService = userService;
            this.mapper = mapper;
        }

        public async Task<ProfileResponse> Handle(GetProfileQuery request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserByUserName(request.Login);
            Guard.Requires(() => user is not null, new EntityNotFoundException(nameof(User), "login", request.Login));

            return mapper.Map<ProfileResponse>(user);
        }
    }
}

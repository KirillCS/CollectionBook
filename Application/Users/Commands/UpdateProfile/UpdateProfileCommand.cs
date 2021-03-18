﻿using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using Domain.Common;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.UpdateProfile
{
    public class UpdateProfileCommand : IRequest<UserDto>
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Biography { get; set; }

        public string Location { get; set; }

        public string WebsiteUrl { get; set; }

        public string TelegramLogin { get; set; }

        public string InstagramLogin { get; set; }
    }

    public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, UserDto>
    {
        private readonly ICurrentUserService currentUserService;
        private readonly IUserService1 userService;
        private readonly IMapper mapper;

        public UpdateProfileCommandHandler(ICurrentUserService currentUserService, IUserService1 userService, IMapper mapper)
        {
            this.currentUserService = currentUserService;
            this.userService = userService;
            this.mapper = mapper;
        }

        public async Task<UserDto> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        {
            var user = await userService.GetUserById(currentUserService.UserId);
            Guard.Requires(() => user is not null, new EntityNotFoundException());
            request.CopyPropertiesTo(user);
            await userService.UpdateUser(user);

            return mapper.Map<UserDto>(user);
        }
    }
}

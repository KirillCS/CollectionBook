using Application.Common.Attributes;
using Application.Common.Interfaces;
using MediatR;
using System;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;
using Application.Common.Exceptions;
using Domain.Common;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Claims;

namespace Application.Common.Behaviors
{
    public class AuthorizationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    {
        private readonly ICurrentUserService currentUserService;
        private readonly IApplicationDbContext context;
        private readonly IUserService userService;
        private readonly IJwtService jwtService;

        public AuthorizationBehaviour(ICurrentUserService currentUserService, IApplicationDbContext context, IUserService userService, IJwtService jwtService)
        {
            this.currentUserService = currentUserService;
            this.context = context;
            this.userService = userService;
            this.jwtService = jwtService;
        }

        public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
        {
            AuthorizeAttribute attribute = request.GetType().GetCustomAttribute<AuthorizeAttribute>();
            if (attribute is null)
            {
                return await next();
            }

            Guard.Requires(() => currentUserService.Id is not null, new UnauthorizedAccessException());
            
            User currentUser = await context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == currentUserService.Id);
            Guard.Requires(() => currentUser is not null, new EntityNotFoundException(nameof(User)));
            Guard.Requires(() => !currentUser.IsBlocked, new UserBlockedException(currentUser.BlockReason));

            string[] requiredRoles = attribute.Roles;
            if (requiredRoles.Length == 0)
            {
                return await next();
            }

            if (!requiredRoles.Any(r => r == currentUser.Role.Name))
            {
                IEnumerable<Claim> claims = userService.GetLoginClaims(currentUser);
                throw new ForbiddenAccessException(jwtService.GenerateJwt(claims));
            }

            return await next();
        }
    }
}

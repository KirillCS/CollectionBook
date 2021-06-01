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

namespace Application.Common.Behaviors
{
    public class AuthorizationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    {
        private readonly ICurrentUserService currentUserService;
        private readonly IApplicationDbContext context;

        public AuthorizationBehaviour(ICurrentUserService currentUserService, IApplicationDbContext context)
        {
            this.currentUserService = currentUserService;
            this.context = context;
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
            Guard.Requires(() => !currentUser.IsBlocked, new UserBlockedException(currentUser.BlockReason));

            string[] requiredRoles = attribute.Roles;
            if (requiredRoles.Length == 0)
            {
                return await next();
            }

            Guard.Requires(() => requiredRoles.Any(r => r == currentUser.Role.Name), new ForbiddenAccessException());

            return await next();
        }
    }
}

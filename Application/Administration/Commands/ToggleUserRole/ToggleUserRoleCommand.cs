using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Administration.Commands.ToggleUserRole
{
    public class ToggleUserRoleCommand : IRequest<string>
    {
        public string Id { get; init; }
    }

    public class ToggleUserRoleCommandHandler : IRequestHandler<ToggleUserRoleCommand, string>
    {
        private readonly IApplicationDbContext context;
        private readonly IRoleService roleService;

        public ToggleUserRoleCommandHandler(IApplicationDbContext context, IRoleService roleService)
        {
            this.context = context;
            this.roleService = roleService;
        }

        public async Task<string> Handle(ToggleUserRoleCommand request, CancellationToken cancellationToken)
        {
            User user = await context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);
            Guard.Requires(() => user is not null, new EntityNotFoundException(nameof(User)));
            Guard.Requires(() => user.Role is not null && user.Role.Name != Roles.Owner, new OperationException());

            Role newRole = roleService.GetExistingRole(user.Role.Name == Roles.User ? Roles.Admin : Roles.User);

            user.RoleId = newRole.Id;
            await context.SaveChanges(cancellationToken);

            return newRole.Name;
        }
    }
}

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using System.Linq;

namespace Infrastructure.Services
{
    public class RoleService : IRoleService
    {
        private readonly IApplicationDbContext context;

        public RoleService(IApplicationDbContext context)
        {
            this.context = context;
        }

        public Role GetExistingRole(int roleId)
        {
            Role role = context.Roles.FirstOrDefault(r => r.Id == roleId);
            Guard.Requires(() => role is not null, new OperationException());

            return role;
        }

        public Role GetExistingRole(string roleName)
        {
            Role role = context.Roles.FirstOrDefault(r => r.Name == roleName);
            Guard.Requires(() => role is not null, new OperationException());

            return role;
        }
    }
}

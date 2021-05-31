using Domain.Entities;

namespace Application.Common.Interfaces
{
    public interface IRoleService
    {
        Role GetExistingRole(int roleId);

        Role GetExistingRole(string roleName);
    }
}

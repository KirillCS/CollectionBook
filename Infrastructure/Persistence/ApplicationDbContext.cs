using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<User>, IApplicationDbContext
    {
        public async Task<int> SaveChanges(CancellationToken cancellationToken)
        {
            return await SaveChangesAsync(cancellationToken);
        }
    }
}

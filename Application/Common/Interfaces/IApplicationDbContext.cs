using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; set; }

        DbSet<Collection> Collections { get; set; }

        DbSet<Tag> Tags { get; set; }

        DbSet<Star> Stars { get; set; }

        Task<int> SaveChanges(CancellationToken cancellationToken);
    }
}

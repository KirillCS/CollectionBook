using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class CollectionConfiguration : IEntityTypeConfiguration<Collection>
    {
        public void Configure(EntityTypeBuilder<Collection> builder)
        {
            builder.Property(c => c.Name).IsRequired().HasMaxLength(256);

            builder.Property(c => c.Description).HasMaxLength(4096);

            builder.Property(c => c.CreationTime).HasDefaultValueSql("getdate()");

            builder.Property(c => c.UserId).IsRequired();
        }
    }
}

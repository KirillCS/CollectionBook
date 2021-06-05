using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class ItemConfiguration : IEntityTypeConfiguration<Item>
    {
        public void Configure(EntityTypeBuilder<Item> builder)
        {
            builder.Property(c => c.Name).IsRequired().HasMaxLength(256);

            builder.Property(c => c.Information).HasMaxLength(4096);

            builder.Property(c => c.CreationTime).HasDefaultValueSql("getutcdate()");

            builder.Property(c => c.CollectionId).IsRequired();
        }
    }
}

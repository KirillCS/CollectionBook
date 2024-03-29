﻿using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.Property(u => u.FirstName).HasMaxLength(128);

            builder.Property(u => u.LastName).HasMaxLength(128);

            builder.Property(u => u.Location).HasMaxLength(256);

            builder.Property(u => u.IsEmailVisible).HasDefaultValue(false);

            builder.Property(u => u.IsBlocked).HasDefaultValue(false);

            builder.Property(u => u.BlockReason).HasMaxLength(256);

            builder.ToTable("Users");
        }
    }
}

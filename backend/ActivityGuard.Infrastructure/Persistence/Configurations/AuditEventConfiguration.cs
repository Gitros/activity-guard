using ActivityGuard.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ActivityGuard.Infrastructure.Persistence.Configurations;

public class AuditEventConfiguration : IEntityTypeConfiguration<AuditEvent>
{
    public void Configure(EntityTypeBuilder<AuditEvent> builder)
    {
        builder.ToTable("AuditEvents");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.EventType)
            .IsRequired()
            .HasMaxLength(100);
        builder.Property(x => x.UserEmail).HasMaxLength(256);
        builder.Property(x => x.TargetType).HasMaxLength(100);
        builder.Property(x => x.TargetId).HasMaxLength(128);
        builder.Property(x => x.MetadataJson).HasMaxLength(4000);

        builder.HasIndex(x => x.AuditLogId);
        builder.HasIndex(x => x.EventType);
        builder.HasIndex(x => x.CreatedAt);
    }
}

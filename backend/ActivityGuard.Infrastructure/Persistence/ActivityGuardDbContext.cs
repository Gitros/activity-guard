using ActivityGuard.Domain;
using Microsoft.EntityFrameworkCore;

namespace ActivityGuard.Infrastructure.Persistence;

public class ActivityGuardDbContext : DbContext
{
    public ActivityGuardDbContext(DbContextOptions<ActivityGuardDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ActivityGuardDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}

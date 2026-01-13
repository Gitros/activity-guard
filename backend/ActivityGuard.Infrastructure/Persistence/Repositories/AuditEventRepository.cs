using ActivityGuard.Application.Common.Interfaces;
using ActivityGuard.Domain;
using ActivityGuard.Infrastructure.Persistence;

namespace ActivityGuard.Infrastructure.Persistence.Repositories;

public class AuditEventRepository : IAuditEventRepository
{
    private readonly ActivityGuardDbContext _db;

    public AuditEventRepository(ActivityGuardDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(AuditEvent auditEvent, CancellationToken ct)
    {
        _db.AuditEvents.Add(auditEvent);
        await _db.SaveChangesAsync(ct);
    }
}

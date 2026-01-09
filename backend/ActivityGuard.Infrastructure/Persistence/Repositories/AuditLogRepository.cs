using ActivityGuard.Application.Common.Interfaces;
using ActivityGuard.Domain;
using Microsoft.EntityFrameworkCore;

namespace ActivityGuard.Infrastructure.Persistence.Repositories;

public sealed class AuditLogRepository : IAuditLogRepository
{
    private readonly ActivityGuardDbContext _db;

    public AuditLogRepository(ActivityGuardDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(AuditLog log, CancellationToken ct = default)
        => await _db.AuditLogs.AddAsync(log, ct);

    public Task SaveChangesAsync(CancellationToken ct = default)
        => _db.SaveChangesAsync(ct);

    public async Task<IReadOnlyList<AuditLog>> GetAsync(
        DateTimeOffset? from,
        DateTimeOffset? to,
        bool? success,
        string? q,
        int take,
        CancellationToken ct = default)
    {
        var query = _db.AuditLogs.AsNoTracking().AsQueryable();

        if (from is not null) query = query.Where(x => x.CreatedAt >= from);
        if (to is not null) query = query.Where(x => x.CreatedAt <= to);
        if (success is not null) query = query.Where(x => x.Success == success);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var s = q.Trim();
            query = query.Where(x =>
                (x.UserEmail != null && x.UserEmail.Contains(s)) ||
                x.Path.Contains(s) ||
                x.Action.Contains(s) ||
                x.Method.Contains(s) ||
                x.CorrelationId.Contains(s));
        }

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .Take(take)
            .ToListAsync(ct);
    }
}

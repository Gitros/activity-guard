using ActivityGuard.Application.Audit;
using ActivityGuard.Application.Common.Interfaces;
using ActivityGuard.Domain;
using Microsoft.EntityFrameworkCore;

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

    public async Task<IReadOnlyList<AuditEventDto>> GetAsync(GetAuditEventsQuery query, CancellationToken ct)
    {
        // join AuditEvents -> AuditLogs (po FK)
        var q = from ev in _db.AuditEvents.AsNoTracking()
                join log in _db.AuditLogs.AsNoTracking()
                    on ev.AuditLogId equals log.Id
                select new { ev, log };

        if (!string.IsNullOrWhiteSpace(query.EventType))
        {
            var et = query.EventType.Trim();
            q = q.Where(x => x.ev.EventType == et);
        }

        if (query.Success is not null)
        {
            q = q.Where(x => x.log.Success == query.Success.Value);
        }

        if (!string.IsNullOrWhiteSpace(query.Q))
        {
            var text = query.Q.Trim();

            q = q.Where(x =>
                (x.ev.UserEmail != null && x.ev.UserEmail.Contains(text)) ||
                x.ev.EventType.Contains(text) ||
                (x.ev.TargetType != null && x.ev.TargetType.Contains(text)) ||
                (x.ev.TargetId != null && x.ev.TargetId.Contains(text)) ||
                (x.ev.MetadataJson != null && x.ev.MetadataJson.Contains(text)) ||
                x.log.Path.Contains(text) ||
                x.log.Method.Contains(text) ||
                x.log.CorrelationId.Contains(text)
            );
        }

        var take = query.Take <= 0 ? 100 : Math.Min(query.Take, 500);

        var result = await q
            .OrderByDescending(x => x.ev.CreatedAt)
            .Take(take)
            .Select(x => new AuditEventDto(
                x.ev.Id,
                x.ev.AuditLogId,
                x.ev.EventType,
                x.ev.UserEmail,
                x.ev.TargetType,
                x.ev.TargetId,
                x.ev.MetadataJson,
                x.ev.CreatedAt,
                x.log.Path,
                x.log.Method,
                x.log.StatusCode,
                x.log.Success,
                x.log.CorrelationId
            ))
            .ToListAsync(ct);

        return result;
    }
}

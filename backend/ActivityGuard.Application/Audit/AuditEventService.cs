using ActivityGuard.Application.Common.Interfaces;
using ActivityGuard.Domain;

namespace ActivityGuard.Application.Audit;

public class AuditEventService
{
    private readonly IAuditEventRepository _repo;

    public AuditEventService(IAuditEventRepository repo)
    {
        _repo = repo;
    }

    public Task AddEventAsync(
        Guid auditLogId,
        Guid? userId,
        string? userEmail,
        string eventType,
        string? targetType,
        string? targetId,
        string? metadataJson,
        CancellationToken ct)
    {
        var ev = new AuditEvent(
            auditLogId,
            userId,
            userEmail,
            eventType,
            targetType,
            targetId,
            metadataJson);

        return _repo.AddAsync(ev, ct);
    }
}

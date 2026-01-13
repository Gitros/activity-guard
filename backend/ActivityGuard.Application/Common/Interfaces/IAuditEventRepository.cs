using ActivityGuard.Domain;

namespace ActivityGuard.Application.Common.Interfaces;

public interface IAuditEventRepository
{
    Task AddAsync(AuditEvent auditEvent, CancellationToken ct);
}

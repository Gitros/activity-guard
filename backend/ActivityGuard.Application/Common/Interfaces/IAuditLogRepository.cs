using ActivityGuard.Domain;

namespace ActivityGuard.Application.Common.Interfaces;

public interface IAuditLogRepository
{
    Task AddAsync(AuditLog log, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);

    Task<IReadOnlyList<AuditLog>> GetAsync(
        DateTimeOffset? from,
        DateTimeOffset? to,
        bool? success,
        string? q,
        int take,
        CancellationToken ct = default);
}

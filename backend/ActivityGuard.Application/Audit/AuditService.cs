using ActivityGuard.Application.Audit.Dtos;
using ActivityGuard.Application.Common.Interfaces;

namespace ActivityGuard.Application.Audit;

public sealed class AuditService
{
    private readonly IAuditLogRepository _repo;

    public AuditService(IAuditLogRepository repo)
    {
        _repo = repo;
    }

    public async Task<IReadOnlyList<AuditLogDto>> GetLogsAsync(
        DateTimeOffset? from,
        DateTimeOffset? to,
        bool? success,
        string? q,
        int take = 100,
        CancellationToken ct = default)
    {
        take = Math.Clamp(take, 1, 500);

        var logs = await _repo.GetAsync(from, to, success, q, take, ct);

        return logs.Select(x => new AuditLogDto(
            x.Id,
            x.UserId,
            x.UserEmail,
            x.Action,
            x.Path,
            x.Method,
            x.StatusCode,
            x.Success,
            x.IpAddress,
            x.UserAgent,
            x.CorrelationId,
            x.CreatedAt
        )).ToList();
    }
}

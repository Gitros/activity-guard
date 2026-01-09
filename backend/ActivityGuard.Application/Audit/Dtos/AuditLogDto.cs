namespace ActivityGuard.Application.Audit.Dtos;

public sealed record AuditLogDto(
    Guid Id,
    Guid? UserId,
    string? UserEmail,
    string Action,
    string Path,
    string Method,
    int StatusCode,
    bool Success,
    string? IpAddress,
    string? UserAgent,
    string CorrelationId,
    DateTimeOffset CreatedAt);

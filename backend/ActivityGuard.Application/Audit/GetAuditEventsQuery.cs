namespace ActivityGuard.Application.Audit;

public sealed record GetAuditEventsQuery(
    string? Q,
    string? EventType,
    bool? Success,
    int Take = 100
);

public sealed record AuditEventDto(
    Guid Id,
    Guid AuditLogId,
    string EventType,
    string? UserEmail,
    string? TargetType,
    string? TargetId,
    string? MetadataJson,
    DateTimeOffset CreatedAt,
    string? Path,
    string? Method,
    int? StatusCode,
    bool? LogSuccess,
    string? CorrelationId
);

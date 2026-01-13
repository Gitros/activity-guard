namespace ActivityGuard.Domain;

public class AuditEvent
{
    public Guid Id { get; private set; }

    // FK -> AuditLog
    public Guid AuditLogId { get; private set; }

    public Guid? UserId { get; private set; }
    public string? UserEmail { get; private set; }

    public string EventType { get; private set; } = null!;

    // opcjonalnie: na czym wykonano akcję
    public string? TargetType { get; private set; }
    public string? TargetId { get; private set; }

    // opcjonalnie: szczegóły, np. JSON
    public string? MetadataJson { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    private AuditEvent() { } // EF

    public AuditEvent(
        Guid auditLogId,
        Guid? userId,
        string? userEmail,
        string eventType,
        string? targetType = null,
        string? targetId = null,
        string? metadataJson = null)
    {
        if (auditLogId == Guid.Empty)
            throw new ArgumentException("AuditLogId is required.", nameof(auditLogId));

        if (string.IsNullOrWhiteSpace(eventType))
            throw new ArgumentException("EventType is required.", nameof(eventType));

        Id = Guid.NewGuid();
        AuditLogId = auditLogId;

        UserId = userId;
        UserEmail = string.IsNullOrWhiteSpace(userEmail) ? null : userEmail.Trim();

        EventType = eventType.Trim();
        TargetType = string.IsNullOrWhiteSpace(targetType) ? null : targetType.Trim();
        TargetId = string.IsNullOrWhiteSpace(targetId) ? null : targetId.Trim();
        MetadataJson = string.IsNullOrWhiteSpace(metadataJson) ? null : metadataJson.Trim();

        CreatedAt = DateTimeOffset.UtcNow;
    }
}

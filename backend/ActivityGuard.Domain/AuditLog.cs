namespace ActivityGuard.Domain;

public class AuditLog
{
    public Guid Id { get; private set; }
    public Guid? UserId { get; private set; }
    public string? UserEmail { get; private set; }
    public string Action { get; private set; } = null!;
    public string Path { get; private set; } = null!;
    public string Method { get; private set; } = null!;
    public int StatusCode { get; private set; }
    public bool Success { get; private set; }
    public string? IpAddress { get; private set; }
    public string? UserAgent { get; private set; }
    public string CorrelationId { get; private set; } = null!;
    public DateTimeOffset CreatedAt { get; private set; }

    public void SetResult(int statusCode, bool success)
    {
        StatusCode = statusCode;
        Success = success;
    }

    private AuditLog() { }

    public AuditLog(
       Guid? userId,
       string? userEmail,
       string action,
       string path,
       string method,
       int statusCode,
       bool success,
       string? ipAddress,
       string? userAgent,
       string correlationId)
    {
        if (string.IsNullOrWhiteSpace(action))
            throw new ArgumentException("Action is required.", nameof(action));

        if (string.IsNullOrWhiteSpace(path))
            throw new ArgumentException("Path is required.", nameof(path));

        if (string.IsNullOrWhiteSpace(method))
            throw new ArgumentException("Method is required.", nameof(method));

        if (string.IsNullOrWhiteSpace(correlationId))
            throw new ArgumentException("CorrelationId is required.", nameof(correlationId));

        Id = Guid.NewGuid();

        UserId = userId;
        UserEmail = string.IsNullOrWhiteSpace(userEmail) ? null : userEmail.Trim();

        Action = action;
        Path = path;
        Method = method;

        StatusCode = statusCode;
        Success = success;

        IpAddress = string.IsNullOrWhiteSpace(ipAddress) ? null : ipAddress.Trim();
        UserAgent = string.IsNullOrWhiteSpace(userAgent) ? null : userAgent.Trim();

        CorrelationId = correlationId;
        CreatedAt = DateTimeOffset.UtcNow;
    }
}

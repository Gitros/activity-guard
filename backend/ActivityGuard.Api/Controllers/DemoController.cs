using ActivityGuard.Application.Audit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActivityGuard.Api.Controllers;

[ApiController]
[Route("demo")]
public class DemoController : ControllerBase
{

    private readonly AuditEventService _events;

    public DemoController(AuditEventService events)
    {
        _events = events;
    }

    private Guid GetAuditLogId()
    {
        if (HttpContext.Items.TryGetValue("AuditLogId", out var val) && val is Guid id)
            return id;

        return Guid.Empty; // fallback (np. gdy middleware nie zadziałał)
    }

    private (Guid? userId, string? email) GetActor()
    {
        var email = User?.Identity?.Name; // jeśli NameClaimType ustawiony na email
                                          // jeśli u Ciebie claimy są inne, to docelowo zrobimy to porządnie
        return (null, email);
    }


    [HttpPost("ping")]
    [Authorize]
    public async Task<IActionResult> Ping(CancellationToken ct)
    {
        var auditLogId = GetAuditLogId();
        var (userId, email) = GetActor();

        if (auditLogId != Guid.Empty)
        {
            await _events.AddEventAsync(
                auditLogId,
                userId,
                email,
                eventType: "DEMO_PING",
                targetType: "Demo",
                targetId: null,
                metadataJson: """{"message":"pong"}""",
                ct);
        }

        return Ok(new { message = "pong" });
    }


    [HttpPost("fail")]
    [Authorize]
    public async Task<IActionResult> Fail(CancellationToken ct)
    {
        var auditLogId = GetAuditLogId();
        var (userId, email) = GetActor();

        if (auditLogId != Guid.Empty)
        {
            await _events.AddEventAsync(
                auditLogId,
                userId,
                email,
                eventType: "DEMO_FAIL",
                targetType: "Demo",
                targetId: null,
                metadataJson: """{"reason":"simulated"}""",
                ct);
        }

        return BadRequest(new ProblemDetails
        {
            Title = "Demo failure",
            Detail = "This endpoint intentionally fails to generate a failed audit log.",
            Status = StatusCodes.Status400BadRequest
        });
    }


    [HttpPost("admin-only")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AdminOnly(CancellationToken ct)
    {
        var auditLogId = GetAuditLogId();
        var (userId, email) = GetActor();

        if (auditLogId != Guid.Empty)
        {
            await _events.AddEventAsync(
                auditLogId,
                userId,
                email,
                eventType: "DEMO_ADMIN_ONLY",
                targetType: "Demo",
                targetId: null,
                metadataJson: null,
                ct);
        }

        return Ok(new { message = "admin action executed" });
    }

}

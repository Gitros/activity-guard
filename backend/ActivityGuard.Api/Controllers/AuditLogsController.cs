using ActivityGuard.Application.Audit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActivityGuard.Api.Controllers;

[ApiController]
[Route("audit-logs")]
public class AuditLogsController : ControllerBase
{
    private readonly AuditService _audit;

    public AuditLogsController(AuditService audit)
    {
        _audit = audit;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] DateTimeOffset? from,
        [FromQuery] DateTimeOffset? to,
        [FromQuery] bool? success,
        [FromQuery] string? q,
        [FromQuery] int take = 100,
        CancellationToken ct = default)
    {
        var result = await _audit.GetLogsAsync(from, to, success, q, take, ct);
        return Ok(result);
    }
}

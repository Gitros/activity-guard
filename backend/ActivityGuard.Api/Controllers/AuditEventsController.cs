using ActivityGuard.Application.Audit;
using ActivityGuard.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActivityGuard.Api.Controllers;

[ApiController]
[Route("audit-events")]
[Authorize(Roles = "Admin")]
public class AuditEventsController : ControllerBase
{
    private readonly IAuditEventRepository _repo;

    public AuditEventsController(IAuditEventRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AuditEventDto>>> Get(
        [FromQuery] string? q,
        [FromQuery] string? eventType,
        [FromQuery] bool? success,
        [FromQuery] int take = 100,
        CancellationToken ct = default)
    {
        var data = await _repo.GetAsync(new GetAuditEventsQuery(q, eventType, success, take), ct);
        return Ok(data);
    }
}

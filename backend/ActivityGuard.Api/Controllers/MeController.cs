using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActivityGuard.Api.Controllers;

[ApiController]
[Route("me")]
public class MeController : ControllerBase
{
    [Authorize]
    [HttpGet]
    public IActionResult Get()
    {
        var email = User.FindFirst("email")?.Value
            ?? User.FindFirst(ClaimTypes.Email)?.Value;

        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        return Ok(new { email, role });
    }
}

using System.Security.Claims;
using ActivityGuard.Domain;
using ActivityGuard.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.JsonWebTokens;

namespace ActivityGuard.Api.Middleware;

public sealed class AuditMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        // (opcjonalnie) pomiń swagger i inne techniczne trasy
        var path = context.Request.Path.Value ?? "";
        if (path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/_debug", StringComparison.OrdinalIgnoreCase))
        {
            await next(context);
            return;
        }

        // CorrelationId (z nagłówka albo generujemy)
        var correlationId = context.Request.Headers.TryGetValue("X-Correlation-Id", out var cid) && !string.IsNullOrWhiteSpace(cid)
            ? cid.ToString()
            : Guid.NewGuid().ToString("N");

        context.Response.Headers["X-Correlation-Id"] = correlationId;

        int statusCode = 0;
        bool success = false;

        try
        {
            await next(context);

            statusCode = context.Response.StatusCode;
            success = statusCode < 400;
        }
        catch
        {
            statusCode = StatusCodes.Status500InternalServerError;
            success = false;
            throw;
        }
        finally
        {
            var userId = TryGetUserId(context.User);
            var userEmail = TryGetEmail(context.User);

            var action = $"{context.Request.Method} {path}";

            var ip = context.Connection.RemoteIpAddress?.ToString();
            var ua = context.Request.Headers.UserAgent.ToString();

            // zapis do DB przez repo
            var repo = context.RequestServices.GetRequiredService<IAuditLogRepository>();

            var log = new AuditLog(
                userId: userId,
                userEmail: userEmail,
                action: action,
                path: path,
                method: context.Request.Method,
                statusCode: statusCode,
                success: success,
                ipAddress: ip,
                userAgent: ua,
                correlationId: correlationId
            );

            try
            {
                await repo.AddAsync(log);
                await repo.SaveChangesAsync();
            }
            catch
            {
                // audyt nie powinien wywracać requestu
                // (opcjonalnie: zalogować do loggera)
            }
        }
    }

    private static Guid? TryGetUserId(ClaimsPrincipal user)
    {
        var sub = user.FindFirstValue(JwtRegisteredClaimNames.Sub)
                  ?? user.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.TryParse(sub, out var id) ? id : null;
    }

    private static string? TryGetEmail(ClaimsPrincipal user)
    {
        return user.FindFirstValue(JwtRegisteredClaimNames.Email)
            ?? user.FindFirstValue(ClaimTypes.Email);
    }
}

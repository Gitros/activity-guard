using System.Security.Claims;
using ActivityGuard.Application.Common.Interfaces;
using ActivityGuard.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.JsonWebTokens;

namespace ActivityGuard.Api.Middleware;

public sealed class AuditMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var path = context.Request.Path.Value ?? "";
        if (path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/_debug", StringComparison.OrdinalIgnoreCase))
        {
            await next(context);
            return;
        }

        var correlationId =
            context.Request.Headers.TryGetValue("X-Correlation-Id", out var cid) &&
            !string.IsNullOrWhiteSpace(cid)
                ? cid.ToString()
                : Guid.NewGuid().ToString("N");

        context.Response.Headers["X-Correlation-Id"] = correlationId;

        int statusCode = 0;
        bool success = false;

        var userId = TryGetUserId(context.User);
        var userEmail = TryGetEmail(context.User);

        var action = $"{context.Request.Method} {path}";
        var ip = context.Connection.RemoteIpAddress?.ToString();
        var ua = context.Request.Headers.UserAgent.ToString();

        var auditLog = new AuditLog(
            userId: userId,
            userEmail: userEmail,
            action: action,
            path: path,
            method: context.Request.Method,
            statusCode: 0,      // tymczasowe
            success: false,     // tymczasowe
            ipAddress: ip,
            userAgent: ua,
            correlationId: correlationId
        );
        context.Items["AuditLogId"] = auditLog.Id;
        context.Items["CorrelationId"] = auditLog.CorrelationId;

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
            auditLog.SetResult(statusCode, success);

            var repo = context.RequestServices.GetRequiredService<IAuditLogRepository>();

            try
            {
                await repo.AddAsync(auditLog);
                await repo.SaveChangesAsync();
            }
            catch
            {
                // audyt nie może wywalić requestu
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

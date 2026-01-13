using ActivityGuard.Application.Common.Errors;
using Microsoft.AspNetCore.Mvc;

namespace ActivityGuard.Api.Middleware;

public sealed class ExceptionHandlingMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            var (status, title) = ex switch
            {
                UnauthorizedException => (StatusCodes.Status401Unauthorized, "Unauthorized"),
                ConflictException => (StatusCodes.Status409Conflict, "Conflict"),
                ArgumentException => (StatusCodes.Status400BadRequest, "Bad Request"),
                _ => (StatusCodes.Status500InternalServerError, "Server Error")
            };

            context.Response.StatusCode = status;
            context.Response.ContentType = "application/problem+json";

            var problem = new ProblemDetails
            {
                Status = status,
                Title = title,
                Detail = status == 500
                    ? "An unexpected error occurred."
                    : ex.Message
            };

            await context.Response.WriteAsJsonAsync(problem);
        }
    }
}

using ActivityGuard.Application.Audit;
using ActivityGuard.Application.Auth;
using Microsoft.Extensions.DependencyInjection;

namespace ActivityGuard.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<AuthService>();
        services.AddScoped<AuditService>();
        services.AddScoped<AuditEventService>();

        return services;
    }
}

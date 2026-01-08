using Microsoft.Extensions.DependencyInjection;
using ActivityGuard.Application.Auth;

namespace ActivityGuard.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<AuthService>();
        return services;
    }
}

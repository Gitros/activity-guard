using ActivityGuard.Application.Common.Interfaces;
using ActivityGuard.Infrastructure.Persistence;
using ActivityGuard.Infrastructure.Persistence.Repositories;
using ActivityGuard.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace ActivityGuard.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // DbContext (SQL Server)
        services.AddDbContext<ActivityGuardDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("Default")));

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();

        // Security
        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));
        services.AddSingleton<IPasswordHasher, PasswordHasherAdapter>();
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();

        return services;
    }
}

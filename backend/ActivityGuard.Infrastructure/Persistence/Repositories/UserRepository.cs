using ActivityGuard.Application.Common.Interfaces;
using ActivityGuard.Domain;
using Microsoft.EntityFrameworkCore;

namespace ActivityGuard.Infrastructure.Persistence.Repositories;

public sealed class UserRepository : IUserRepository
{
    private readonly ActivityGuardDbContext _db;

    public UserRepository(ActivityGuardDbContext db)
    {
        _db = db;
    }

    public Task<bool> EmailExistsAsync(string email, CancellationToken ct = default)
        => _db.Users.AnyAsync(u => u.Email == email, ct);

    public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
        => _db.Users.FirstOrDefaultAsync(u => u.Email == email, ct);

    public async Task AddAsync(User user, CancellationToken ct = default)
        => await _db.Users.AddAsync(user, ct);

    public Task SaveChangesAsync(CancellationToken ct = default)
        => _db.SaveChangesAsync(ct);
}

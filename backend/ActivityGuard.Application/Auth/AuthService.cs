using ActivityGuard.Application.Auth.Dtos;
using ActivityGuard.Application.Common.Errors;
using ActivityGuard.Application.Common.Interfaces;
using ActivityGuard.Domain;

namespace ActivityGuard.Application.Auth;

public sealed class AuthService
{
    private readonly IUserRepository _users;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtTokenGenerator _jwt;

    public AuthService(IUserRepository users, IPasswordHasher hasher, IJwtTokenGenerator jwt)
    {
        _users = users;
        _hasher = hasher;
        _jwt = jwt;
    }

    public async Task RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        var email = request.Email.Trim();

        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email is required.");

        if (string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentException("Password is required.");

        if (await _users.EmailExistsAsync(email, ct))
            throw new ConflictException("Email already exists.");

        var hash = _hasher.Hash(request.Password);

        var user = new User(email, hash, UserRole.Admin);

        await _users.AddAsync(user, ct);
        await _users.SaveChangesAsync(ct);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var email = request.Email.Trim();

        var user = await _users.GetByEmailAsync(email, ct);
        if (user is null)
            throw new UnauthorizedAccessException("Invalid credentials.");

        if (!_hasher.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");

        var token = _jwt.Generate(user);
        return new AuthResponse(token);
    }
}

using ActivityGuard.Application.Common.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace ActivityGuard.Infrastructure.Security;

public sealed class PasswordHasherAdapter : IPasswordHasher
{
    private readonly PasswordHasher<object> _hasher = new();

    public string Hash(string password)
        => _hasher.HashPassword(new object(), password);

    public bool Verify(string password, string passwordHash)
    {
        var result = _hasher.VerifyHashedPassword(new object(), passwordHash, password);
        return result == PasswordVerificationResult.Success ||
               result == PasswordVerificationResult.SuccessRehashNeeded;
    }
}

using ActivityGuard.Domain;

namespace ActivityGuard.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    string Generate(User user);
}

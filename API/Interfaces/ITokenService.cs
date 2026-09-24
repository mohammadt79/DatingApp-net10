using API.Entities;

namespace API.Interfaces;

public interface ITokenService
{
    string CreateToken(AppUser user);
    void RevokeToken(string token);
    bool IsTokenRevoked(string token);
}

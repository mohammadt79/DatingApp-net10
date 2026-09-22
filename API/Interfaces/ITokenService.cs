using API.DTO;

namespace API.Interfaces;

public interface ITokenService
{
    string CreateToken(AppUserDto user);
}

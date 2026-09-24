using API.DTO;
using API.Entities;
using API.Services;
using Microsoft.Extensions.Configuration;

namespace API.Tests;

public class UserDtoTests
{
    [Fact]
    public void UserDto_ShouldContainUsernameAndToken()
    {
        var dto = new UserDto
        {
            UserName = "alice",
            Token = "test-token"
        };

        Assert.Equal("alice", dto.UserName);
        Assert.Equal("test-token", dto.Token);
    }

    [Fact]
    public void TokenService_ShouldCreateJwtTokenForUser()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["TokenKey"] = "1234567890123456789012345678901234567890123456789012345678901234"
            })
            .Build();

        var service = new TokenService(configuration);
        var user = new AppUser
        {
            UserName = "alice",
            PasswordHash = Array.Empty<byte>(),
            PasswordSalt = Array.Empty<byte>()
        };

        var token = service.CreateToken(user);

        Assert.False(string.IsNullOrWhiteSpace(token));
    }

    [Fact]
    public void TokenService_ShouldRevokeToken()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["TokenKey"] = "1234567890123456789012345678901234567890123456789012345678901234"
            })
            .Build();

        var service = new TokenService(configuration);
        var user = new AppUser
        {
            UserName = "alice",
            PasswordHash = Array.Empty<byte>(),
            PasswordSalt = Array.Empty<byte>()
        };

        var token = service.CreateToken(user);

        service.RevokeToken(token);

        Assert.True(service.IsTokenRevoked(token));
    }
}

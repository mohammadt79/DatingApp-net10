using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

public class TokenService(IConfiguration configuration) : ITokenService
{
    private static readonly ConcurrentDictionary<string, byte> RevokedTokens = new(StringComparer.Ordinal);
    private readonly IConfiguration _configuration = configuration;

    public string CreateToken(AppUser user)
    {
        var tokenKey = _configuration["TokenKey"] ??
            throw new InvalidOperationException("TokenKey is missing from configuration.");

        if (string.IsNullOrWhiteSpace(tokenKey))
        {
            throw new InvalidOperationException("TokenKey cannot be empty.");
        }

        if (tokenKey.Length < 64)
        {
            throw new InvalidOperationException("TokenKey must be at least 64 characters long.");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public void RevokeToken(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return;
        }

        var normalizedToken = NormalizeToken(token);
        if (string.IsNullOrWhiteSpace(normalizedToken))
        {
            return;
        }

        RevokedTokens[normalizedToken] = 1;
    }

    public bool IsTokenRevoked(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return false;
        }

        var normalizedToken = NormalizeToken(token);
        return !string.IsNullOrWhiteSpace(normalizedToken) && RevokedTokens.ContainsKey(normalizedToken);
    }

    private static string NormalizeToken(string token)
    {
        var normalizedToken = token.Trim();
        const string bearerPrefix = "Bearer ";

        if (normalizedToken.StartsWith(bearerPrefix, StringComparison.OrdinalIgnoreCase))
        {
            normalizedToken = normalizedToken[bearerPrefix.Length..].Trim();
        }

        return normalizedToken;
    }
}

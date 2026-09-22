using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTO;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(DataContext context, ITokenService tokenService) : BaseApiController
{
    private readonly DataContext _context = context;
    private readonly ITokenService _tokenService = tokenService;

    [HttpPost("register")]
    public async Task<ActionResult<AppUserDto>> Register([FromBody] RegisterDto registerDto)
    {
        if (registerDto == null)
        {
            return BadRequest("Register data is required.");
        }

        if (string.IsNullOrWhiteSpace(registerDto.Username) || string.IsNullOrWhiteSpace(registerDto.Password))
        {
            return BadRequest("Username and password are required.");
        }

        var usernameExists = await UserExists(registerDto.Username);
        if (usernameExists)
        {
            return Conflict("Username already exists.");
        }

        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            UserName = registerDto.Username,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
            PasswordSalt = hmac.Key
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var appUserDto = new AppUserDto
        {
            Id = user.Id,
            UserName = user.UserName
        };

        appUserDto.Token = _tokenService.CreateToken(appUserDto);

        return Ok(appUserDto);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AppUserDto>> Login([FromBody] LoginDto loginDto)
    {
        if (loginDto == null)
        {
            return BadRequest("Login data is required.");
        }

        if (string.IsNullOrWhiteSpace(loginDto.Username) || string.IsNullOrWhiteSpace(loginDto.Password))
        {
            return BadRequest("Username and password are required.");
        }

        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName.ToLower() == loginDto.Username.ToLower());

        if (user == null)
        {
            return Unauthorized("Invalid username or password.");
        }

        if (!VerifyPasswordHash(loginDto.Password, user.PasswordHash, user.PasswordSalt))
        {
            return Unauthorized("Invalid username or password.");
        }

        var appUserDto = new AppUserDto
        {
            Id = user.Id,
            UserName = user.UserName
        };

        appUserDto.Token = _tokenService.CreateToken(appUserDto);

        return Ok(appUserDto);
    }

    private async Task<bool> UserExists(string username)
    {
        return await _context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
    }

    private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
    {
        using var hmac = new HMACSHA512(storedSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return computedHash.SequenceEqual(storedHash);
    }
}

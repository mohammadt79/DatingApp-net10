using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

public class AppUser
{
    public int Id { get; set; }
    public required string UserName { get; set; }
    public required byte[] PasswordHash { get; set; } = [];
    public required byte[] PasswordSalt { get; set; } = [];

    [NotMapped]
    public string Password { get; set; } = string.Empty;

    [NotMapped]
    public string Token { get; set; } = string.Empty;
}

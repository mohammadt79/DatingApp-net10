namespace API.DTO;

public class AppUserDto
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
}

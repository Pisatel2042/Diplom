namespace WebApplication1.Models;

public class PasswordResetToken
{
    public int Id { get; set; }
    public string? Email { get; set; }
    public string? Token { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool Used { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

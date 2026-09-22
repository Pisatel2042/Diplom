namespace WebApplication1.Models;

public class EmailVerificationCode
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Code { get; set; } = "";
    public DateTime ExpiresAt { get; set; }
    public bool Used { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models;

[Table("Users")]
public class User
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? PasswordHash { get; set; }
    public string? Role { get; set; }
    public string? Phone { get; set; }
    public string? Telegram { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; }
    public bool EmailConfirmed { get; set; }

    public string? VerificationCode { get; set; }
    public DateTime? VerificationExpires { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; }
    public string? GoogleId { get; set;}
    public string? GoogleAvatarUrl { get; set;}
    public string? Level { get; set; }
    public string? LevelLabel { get; set; }
    public string? Goals { get; set; }
    public int LessonsCompleted { get; set; }
    public int LessonsTotal { get; set; }
    public int Rank { get; set; }
}
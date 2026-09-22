using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models;

[Table("Notifications")]
public class Notification
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string? Type { get; set; }
    public string? Text { get; set; }
    public bool IsRead { get; set; }
    public string? TimeAgo { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

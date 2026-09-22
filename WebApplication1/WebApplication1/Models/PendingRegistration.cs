using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models;

[Table("PendingRegistrations")]
public class PendingRegistration
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Email { get; set; }

    public string? PasswordHash { get; set; }

    public string? Phone { get; set; }

    public string? Telegram { get; set; }

    public string? AvatarUrl { get; set; }

    public string? Code { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
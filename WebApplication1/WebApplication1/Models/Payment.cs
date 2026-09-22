using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models;

[Table("Payments")]
public class Payment
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal Amount { get; set; }
    public int LessonCount { get; set; }
    public DateTime Date { get; set; }
    public string? Status { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

namespace WebApplication1.Models;

public class Review
{
    public int Id { get; set; }
    public string? StudentName { get; set; } 
    public string? LevelFrom { get; set; }
    public string? LevelTo { get; set; } 
    public string? Text { get; set; }
    public int UserId { get; set; }
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
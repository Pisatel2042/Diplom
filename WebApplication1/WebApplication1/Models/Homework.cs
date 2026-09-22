using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models;

[Table("Homeworks")]
public class Homework
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int? LessonId { get; set; }
    public string? Title { get; set; }
    public string? Status { get; set; }
    public string? Files { get; set; }
    public string? Comment { get; set; }
    public bool TeacherComment { get; set; }
    public string? DueDate { get; set; }
    public int? Grade { get; set; }
    public string? TestLink { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

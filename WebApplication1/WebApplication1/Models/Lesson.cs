using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models;

[Table("Lessons")]
public class Lesson
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int TeacherId { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan Time { get; set; }
    public string? Topic { get; set; }
    public string? Status { get; set; }
    public string? RescheduleNote { get; set; }
    public string? MeetingLink { get; set; }
    public string? RecordingUrl { get; set; }
    public string? TeacherNotes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; }
}

using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models;

[Table("StudentSchedules")]
public class StudentSchedule
{
    public int Id { get; set; }

    public int StudentId { get; set; }

    public int DayOfWeek { get; set; }

    public string? Time { get; set; }

    public bool IsActive { get; set; } = true;
}
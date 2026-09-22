using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/lessons")]
[Authorize]
public class LessonsController : ControllerBase
{
    private readonly DBContext _context;

    public LessonsController(DBContext context) { _context = context; }

    [HttpGet("my")]
    public IActionResult GetMyLessons([FromQuery] string filter = "all")
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
        if (userIdClaim == null) return Unauthorized();
        var userId = int.Parse(userIdClaim);

        var query = _context.Lessons.Where(l => l.StudentId == userId);

        if (filter == "upcoming")
            query = query.Where(l => l.Status == "scheduled" || l.Status == "upcoming" || l.Status == "rescheduled");
        else if (filter == "past")
            query = query.Where(l => l.Status == "completed" || l.Status == "cancelled");

        var lessons = query.OrderBy(l => l.Date).ToList().Select(l => new
        {
            id = l.Id,
            date = l.Date.ToString("yyyy-MM-dd"),
            time = l.Time.ToString(@"hh\:mm"),
            topic = l.Topic,
            link = l.MeetingLink,
            status = l.Status,
            note = l.RescheduleNote,
            recording = l.RecordingUrl,
            teacherComment = l.TeacherNotes,
            materials = (string[]?)null
        }).ToList();

        return Ok(lessons);
    }

    [HttpGet("all")]
    public IActionResult GetAllLessons([FromQuery] string filter = "all")
    {
        var query = _context.Lessons.AsQueryable();

        if (filter == "upcoming")
            query = query.Where(l => l.Status == "scheduled" || l.Status == "upcoming" || l.Status == "rescheduled");
        else if (filter == "past")
            query = query.Where(l => l.Status == "completed" || l.Status == "cancelled");

        var raw = query.OrderBy(l => l.Date).ToList();

        var studentIds = raw.Select(l => l.StudentId).Distinct().ToList();
        var students = _context.User.Where(u => studentIds.Contains(u.Id)).ToDictionary(u => u.Id, u => u.Name ?? "");

        var lessons = raw.Select(l => new
        {
            id = l.Id,
            date = l.Date.ToString("yyyy-MM-dd"),
            time = l.Time.ToString(@"hh\:mm"),
            topic = l.Topic,
            link = l.MeetingLink,
            status = l.Status,
            note = l.RescheduleNote,
            recording = l.RecordingUrl,
            teacherComment = l.TeacherNotes,
            materials = (string[]?)null,
            studentId = l.StudentId,
            studentName = students.GetValueOrDefault(l.StudentId, "")
        }).ToList();

        return Ok(lessons);
    }

    [HttpPost("{id}/reschedule")]
    public IActionResult RescheduleLesson(int id, [FromBody] RescheduleDto dto)
    {
        try
        {
            var lesson = _context.Lessons.Find(id);
            if (lesson == null)
                return NotFound(new { message = "Урок не найден" });

            var oldDate = lesson.Date.ToString("dd.MM");
            var oldTime = lesson.Time.ToString(@"hh\:mm");

            if (DateOnly.TryParse(dto.NewDate, out var newDate) && TimeOnly.TryParse(dto.NewTime, out var newTime))
            {
                lesson.Date = newDate.ToDateTime(TimeOnly.MinValue);
                lesson.Time = newTime.ToTimeSpan();
            }
            else
            {
                return BadRequest(new { message = "Неверный формат даты или времени" });
            }

            lesson.Status = "scheduled";
            lesson.RescheduleNote = $"Перенесён с {oldDate} {oldTime}. Причина: {dto.Reason}";
            lesson.UpdatedAt = DateTime.UtcNow;

            var newDateStr = newDate.ToString("dd.MM");
            var newTimeStr = newTime.ToString(@"hh\:mm");

            var notification = new Notification
            {
                UserId = lesson.StudentId,
                Type = "reschedule",
                Text = $"Урок перенесён на {newDateStr} в {newTimeStr}. Причина: {dto.Reason}",
                IsRead = false,
                TimeAgo = "только что"
            };
            _context.Notifications.Add(notification);

            _context.SaveChanges();
            return Ok(new { message = "Урок перенесён" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ошибка сервера: " + ex.Message });
        }
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateLesson(int id, [FromBody] UpdateLessonDto dto)
    {
        var lesson = await _context.Lessons.FindAsync(id);
        if (lesson == null)
            return NotFound(new { message = "Урок не найден" });

        if (!string.IsNullOrEmpty(dto.RecordingUrl))
            lesson.RecordingUrl = dto.RecordingUrl;

        if (!string.IsNullOrEmpty(dto.TeacherComment))
            lesson.TeacherNotes = dto.TeacherComment;

        if (!string.IsNullOrEmpty(dto.MeetingLink))
            lesson.MeetingLink = dto.MeetingLink;

        lesson.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Урок обновлён", recording = lesson.RecordingUrl, teacherComment = lesson.TeacherNotes, meetingLink = lesson.MeetingLink });
    }
}

public class RescheduleDto
{
    public string Reason { get; set; } = "";
    public string? NewDate { get; set; }
    public string? NewTime { get; set; }
}

public class UpdateLessonDto
{
    public string? RecordingUrl { get; set; }
    public string? TeacherComment { get; set; }
    public string? MeetingLink { get; set; }
}

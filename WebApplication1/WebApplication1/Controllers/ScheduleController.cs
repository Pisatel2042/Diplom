using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/schedule")]
public class ScheduleController : ControllerBase
{
    private readonly DBContext _context;

    public ScheduleController(DBContext context)
    {
        _context = context;
    }

    [HttpGet("busy")]
    public IActionResult Busy()
    {
        var data = _context.Lessons
            .Where(x => x.Status == "scheduled")
            .Select(x => new
            {
                date = x.Date.ToString("yyyy-MM-dd"),
                time = x.Time.ToString(@"hh\:mm")
            })
            .ToList();

        return Ok(data);
    }

    [HttpPost]
    public IActionResult Save(ScheduleDto dto)
    {
        if (!DateOnly.TryParse(dto.Date, out var parsedDate))
            return BadRequest(new { message = "Неверный формат даты" });

        if (!TimeOnly.TryParse(dto.Time, out var parsedTime))
            return BadRequest(new { message = "Неверный формат времени" });

        var dateTime = parsedDate.ToDateTime(parsedTime);

        var exists = _context.Lessons.Any(x =>
            x.Date == dateTime &&
            x.Time == parsedTime.ToTimeSpan() &&
            x.Status == "scheduled"
        );

        if (exists)
            return BadRequest(new { message = "Это время уже занято" });

        _context.Lessons.Add(new Lesson
        {
            StudentId = dto.StudentId,
            TeacherId = 1,
            Date = dateTime,
            Time = parsedTime.ToTimeSpan(),
            Topic = "Индивидуальное занятие",
            Status = "scheduled"
        });

        _context.SaveChanges();

        return Ok(new { message = "Урок записан" });
    }

    [HttpGet("{studentId}")]
    public IActionResult GetStudentSchedule(int studentId)
    {
        var result = _context.Lessons
            .Where(x => x.StudentId == studentId)
            .OrderBy(x => x.Date)
            .Select(x => new
            {
                id = x.Id,
                date = x.Date.ToString("yyyy-MM-dd"),
                time = x.Time.ToString(@"hh\:mm"),
                topic = x.Topic,
                status = x.Status
            })
            .ToList();

        return Ok(result);
    }
}

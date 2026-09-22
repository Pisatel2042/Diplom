using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/teacher")]
public class TeacherController : ControllerBase
{
    private readonly DBContext _context;

    public TeacherController(DBContext context)
    {
        _context = context;
    }

    [HttpGet("dashboard")]
    public IActionResult Dashboard()
    {
        var result = new
        {
            stats = new
            {
                students = _context.User.Count(x => x.Role == "Student"),
                lessons = _context.Lessons.Count(),
                homework = _context.Homeworks.Count()
            },
            lessons = _context.Lessons
                .OrderBy(x => x.Date)
                .Take(5)
                .Select(x => new
                {
                    id = x.Id,
                    student = _context.User
                        .Where(u => u.Id == x.StudentId)
                        .Select(u => u.Name)
                        .FirstOrDefault(),
                    topic = x.Topic,
                    time = x.Date.ToString("dd.MM.yyyy HH:mm")
                })
                .ToList(),
            homework = _context.Homeworks
                .Take(5)
                .Select(x => new
                {
                    id = x.Id,
                    student = _context.User
                        .Where(u => u.Id == x.StudentId)
                        .Select(u => u.Name)
                        .FirstOrDefault(),
                    title = x.Title
                })
                .ToList(),
            notifications = _context.Notifications
                .OrderByDescending(x => x.CreatedAt)
                .Take(5)
                .Select(x => new
                {
                    id = x.Id,
                    user = _context.User
                        .Where(u => u.Id == x.UserId)
                        .Select(u => u.Name)
                        .FirstOrDefault(),
                    text = x.Text,
                    type = x.Type,
                    createdAt = x.CreatedAt
                })
                .ToList()
        };

        return Ok(result);
    }
    
    [HttpGet("students")]
    public IActionResult GetStudents()
    {
        var students = _context.User
            .Where(x => x.Role == "Student")
            .Select(x => new
            {
                id = x.Id,
                name = x.Name,
                email = x.Email,
                phone = x.Phone,
                avatar = x.AvatarUrl,
                level = x.Level,
                telegram = x.Telegram,
                lessons = _context.Lessons.Count(l => l.StudentId == x.Id),
                homework = _context.Homeworks.Count(h => h.StudentId == x.Id),
                next = _context.Lessons
                    .Where(l => l.StudentId == x.Id && l.Date >= DateTime.Now)
                    .OrderBy(l => l.Date)
                    .Select(l => l.Date.ToString("dd.MM.yyyy HH:mm"))
                    .FirstOrDefault()
            })
            .ToList();

        return Ok(students);
    }
    
    [HttpGet("schedule")]
    [HttpGet("schedule")]
    public IActionResult GetSchedule()
    {
        var lessons = _context.Lessons
            .OrderBy(x => x.Date)
            .Select(x => new
            {
                id = x.Id,

                day = x.Date.Day,

                student = _context.User
                    .Where(u => u.Id == x.StudentId)
                    .Select(u => u.Name)
                    .FirstOrDefault(),

                time = x.Date.ToString("HH:mm"),

                topic = x.Topic
            })
            .ToList();

        return Ok(lessons);
    }
    
    [HttpGet("homework")]
    public IActionResult GetHomework()
    {
        var homework = _context.Homeworks
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                id = x.Id,
                studentId = x.StudentId,
                student = _context.User
                    .Where(u => u.Id == x.StudentId)
                    .Select(u => u.Name)
                    .FirstOrDefault(),
                title = x.Title,
                status = x.Status,
                testLink = x.TestLink,
                grade = x.Grade,
                comment = x.Comment
            })
            .ToList();

        return Ok(homework);
    }
    
    [HttpPut("homework/{id}")]
    [HttpPut("homework/{id}")]
    public IActionResult UpdateHomework(int id, [FromBody] UpdateHomeworkDto dto)
    {
        var hw = _context.Homeworks.Find(id);

        if (hw == null)
            return NotFound();

        hw.Grade = dto.Grade;
        hw.Comment = dto.Comment;
        hw.Status = "Проверено";
        hw.TeacherComment = true;

        _context.SaveChanges();

        return Ok();
    }
    [HttpPost("homework")]
    public IActionResult CreateHomework([FromBody] Homework dto)
    {
        dto.Status = "Не проверено";
        dto.CreatedAt = DateTime.UtcNow;
        dto.TeacherComment = false;

        _context.Homeworks.Add(dto);

        _context.SaveChanges();

        return Ok(new
        {
            id = dto.Id,
            studentId = dto.StudentId,
            title = dto.Title,
            status = dto.Status,
            testLink = dto.TestLink,
            grade = dto.Grade,
            comment = dto.Comment
        });
    }
    [HttpPost("notification")]
    public IActionResult SendNotification([FromBody] CreateNotificationDto dto)
    {
        var notification = new Notification
        {
            UserId = dto.UserId,
            Text = dto.Text,
            Type = dto.Type,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);

        _context.SaveChanges();

        return Ok();
    }
    
    public class UpdateHomeworkDto
    {
        public int? Grade { get; set; }

        public string? Comment { get; set; }
    }
}


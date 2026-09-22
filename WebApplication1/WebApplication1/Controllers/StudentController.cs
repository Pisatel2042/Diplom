using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/student")]
public class StudentController : ControllerBase
{
    private readonly DBContext _context;

    public StudentController(DBContext context)
    {
        _context = context;
    }

 

    [HttpGet("profile/{id}")]
    public IActionResult GetProfile(int id)
    {
        var user = _context.User
            .Where(x => x.Id == id)
            .Select(x => new
            {
                id = x.Id,
                name = x.Name,
                email = x.Email,
                phone = x.Phone,
                telegram = x.Telegram,
                avatar = x.AvatarUrl,
                level = x.Level
            })
            .FirstOrDefault();

        if (user == null)
            return NotFound();

        return Ok(user);
    }



    [HttpGet("schedule/{id}")]
    public IActionResult GetSchedule(int id)
    {
        var lessons = _context.Lessons

            .Where(x => x.StudentId == id)

            .OrderBy(x => x.Date)

            .ToList()

            .Select(x => new
            {
                id = x.Id,

                date = x.Date.ToString("dd.MM.yyyy"),

                time = x.Date.ToString("HH:mm"),

                topic = x.Topic,

                teacher = _context.User
                    .Where(u => u.Id == x.TeacherId)
                    .Select(u => u.Name)
                    .FirstOrDefault()
            });

        return Ok(lessons);
    }
    [HttpPut("notifications/read/{id}")]
    public IActionResult ReadNotification(int id)
    {
        var notification = _context.Notifications.FirstOrDefault(x => x.Id == id);

        if (notification == null)
            return NotFound();

        notification.IsRead = true;

        _context.SaveChanges();

        return Ok();
    }
    [HttpPut("notifications/read-all/{userId}")]
    public IActionResult ReadAllNotifications(int userId)
    {
        var notifications = _context.Notifications
            .Where(x => x.UserId == userId)
            .ToList();

        foreach (var item in notifications)
        {
            item.IsRead = true;
        }

        _context.SaveChanges();

        return Ok();
    }
    [HttpPut("profile/{id}")]
    public IActionResult UpdateProfile(int id, [FromBody] UpdateProfileDto dto)
    {
        var user = _context.User.FirstOrDefault(x => x.Id == id);

        if (user == null)
            return NotFound();

        user.Name = dto.Name;

        user.Phone = dto.Phone;

        user.Telegram = dto.Telegram;

        _context.SaveChanges();

        return Ok();
    }


    [HttpGet("homework/{id}")]
    public IActionResult GetHomework(int id)
    {
        var homework = _context.Homeworks
            .Where(x => x.StudentId == id)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                id = x.Id,

                title = x.Title,

                status = x.Status,

                testLink = x.TestLink,

                grade = x.Grade,

                comment = x.Comment,

                dueDate = x.DueDate
            })
            .ToList();

        return Ok(homework);
    }


    [HttpGet("notifications/{id}")]
    public IActionResult GetNotifications(int id)
    {
        var notifications = _context.Notifications

            .Where(x => x.UserId == id)

            .OrderByDescending(x => x.CreatedAt)

            .Select(x => new
            {
                id = x.Id,

                text = x.Text,

                type = x.Type,

                createdAt = x.CreatedAt
            })

            .ToList();

        return Ok(notifications);
    }



    [HttpGet("payments/{id}")]
    public IActionResult GetPayments(int id)
    {
        var payments = _context.Payments

            .Where(x => x.UserId == id)

            .OrderByDescending(x => x.Date)

            .Select(x => new
            {
                id = x.Id,

                amount = x.Amount,

                status = x.Status,

                date = x.Date
            })

            .ToList();

        return Ok(payments);
    }



    [HttpGet("records/{id}")]
    public IActionResult GetRecords(int id)
    {
        var records = _context.Lessons

            .Where(x =>
                x.StudentId == id &&
                x.RecordingUrl != null)

            .OrderByDescending(x => x.Date)

            .Select(x => new
            {
                id = x.Id,

                topic = x.Topic,

                date = x.Date.ToString("dd.MM.yyyy"),

                url = x.RecordingUrl
            })

            .ToList();

        return Ok(records);
    }



    [HttpGet("grades/{id}")]
    public IActionResult GetGrades(int id)
    {
        var grades = _context.Homeworks

            .Where(x =>
                x.StudentId == id &&
                x.Grade != null)

            .OrderByDescending(x => x.CreatedAt)

            .Select(x => new
            {
                id = x.Id,

                title = x.Title,

                grade = x.Grade,

                comment = x.Comment
            })

            .ToList();

        return Ok(grades);
    }
    
    
    [HttpGet("dashboard/{id}")]
    public IActionResult GetDashboard(int id)
    {
        var user = _context.User.FirstOrDefault(x => x.Id == id);

        if (user == null)
            return NotFound();

        var nextLesson = _context.Lessons
            .Where(x => x.StudentId == id && x.Date >= DateTime.Now)
            .OrderBy(x => x.Date)
            .FirstOrDefault();

        var homework = _context.Homeworks
            .Where(x => x.StudentId == id)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefault();

        var lessonsCount = _context.Lessons.Count(x => x.StudentId == id);

        var homeworkCount = _context.Homeworks.Count(x =>
            x.StudentId == id &&
            x.Status == "Проверено");

        var average = _context.Homeworks
            .Where(x => x.StudentId == id && x.Grade != null)
            .Select(x => (double?)x.Grade)
            .Average() ?? 0;

        return Ok(new
        {
            name = user.Name,

            level = user.Level,

            nextLesson = nextLesson == null
                ? null
                : new
                {
                    date = nextLesson.Date.ToString("dd MMMM"),
                    time = nextLesson.Date.ToString("HH:mm")
                },

            homework = homework == null
                ? null
                : new
                {
                    title = homework.Title,
                    status = homework.Status
                },

            lessonsCount,

            homeworkCount,

            average = Math.Round(average, 1)
        });
    }
}
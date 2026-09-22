using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly DBContext _context;

    public PaymentsController(DBContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpGet("my")]
    public IActionResult GetMyPayments()
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var payments = _context.Payments
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToList();

        return Ok(payments);
    }

    [Authorize]
    [HttpPost]
    public IActionResult CreatePayment([FromBody] CreatePaymentDto dto)
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        if (dto.Slots != null && dto.Slots.Count > 0)
        {
            var teacher = _context.User.FirstOrDefault(u => u.Role == "teacher" || u.Role == "Teacher");
            if (teacher == null)
                return BadRequest(new { message = "Преподаватель не найден в системе" });

            var newLessons = new List<Lesson>();

            foreach (var slot in dto.Slots)
            {
                if (!DateOnly.TryParse(slot.Date, out var date) || !TimeOnly.TryParse(slot.Time, out var time))
                    continue;

                var dayStart = date.ToDateTime(TimeOnly.MinValue);
                var dayEnd = date.ToDateTime(TimeOnly.MaxValue);

                var alreadyBooked = _context.Lessons.Any(l =>
                    l.Date >= dayStart && l.Date <= dayEnd &&
                    l.Time == time.ToTimeSpan() &&
                    l.Status != "cancelled");

                if (alreadyBooked)
                    return Conflict(new { message = $"Слот {slot.Date} {slot.Time} уже занят" });

                newLessons.Add(new Lesson
                {
                    StudentId = userId,
                    TeacherId = teacher.Id,
                    Date = dayStart,
                    Time = time.ToTimeSpan(),
                    Topic = "Занятие по английскому",
                    Status = "scheduled",
                    UpdatedAt = DateTime.UtcNow
                });
            }

            _context.Lessons.AddRange(newLessons);
        }

        var payment = new Payment
        {
            UserId = userId,
            Amount = dto.Amount,
            LessonCount = dto.LessonCount,
            Status = "paid"
        };
        _context.Payments.Add(payment);

        _context.Notifications.Add(new Notification
        {
            UserId = userId,
            Type = "payment",
            Text = $"Оплачено {dto.LessonCount} занят{(dto.LessonCount % 10 == 1 && dto.LessonCount % 100 != 11 ? "ие" : "ия")} на сумму {dto.Amount} ₽",
            IsRead = false,
            TimeAgo = "только что"
        });

        _context.SaveChanges();

        return Ok(new { paymentId = payment.Id });
    }
}

public class CreatePaymentDto
{
    public decimal Amount { get; set; }
    public int LessonCount { get; set; }
    public List<SlotDto>? Slots { get; set; }
}

public class SlotDto
{
    public string Date { get; set; } = "";
    public string Time { get; set; } = "";
}

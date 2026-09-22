using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly DBContext _context;

    public NotificationsController(DBContext context) { _context = context; }

    [HttpGet("my")]
    public IActionResult GetMyNotifications()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
        if (userIdClaim == null) return Unauthorized();
        var userId = int.Parse(userIdClaim);

        var notifications = _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new
            {
                id = n.Id,
                type = n.Type,
                text = n.Text,
                time = n.TimeAgo ?? "",
                unread = !n.IsRead
            }).ToList();

        return Ok(notifications);
    }

    [HttpPost]
    public IActionResult CreateNotification([FromBody] CreateNotificationDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Text))
            return BadRequest(new { message = "Текст уведомления обязателен" });

        var targetUsers = new List<int>();

        if (dto.UserId.HasValue)
        {
            targetUsers.Add(dto.UserId.Value);
        }
        else if (dto.ToAll)
        {
            targetUsers = _context.User.Where(u => u.Role == "student" || u.Role == "Student").Select(u => u.Id).ToList();
        }
        else
        {
            return BadRequest(new { message = "Укажите userId или toAll=true" });
        }

        foreach (var uid in targetUsers)
        {
            _context.Notifications.Add(new Notification
            {
                UserId = uid,
                Type = dto.Type ?? "teacher",
                Text = dto.Text,
                IsRead = false,
                TimeAgo = "только что"
            });
        }

        _context.SaveChanges();
        return Ok(new { count = targetUsers.Count });
    }
}

public class CreateNotificationDto
{
    public string Text { get; set; } = "";
    public string? Type { get; set; }
    public int? UserId { get; set; }
    public bool ToAll { get; set; }
}

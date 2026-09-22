using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using System.Text.Json;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/homework")]
[Authorize]
public class HomeworkController : ControllerBase
{
    private readonly DBContext _context;

    public HomeworkController(DBContext context) { _context = context; }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyHomework()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
        if (userIdClaim == null) return Unauthorized();
        var userId = int.Parse(userIdClaim);

        var homeworks = await _context.Homeworks
            .Where(h => h.StudentId == userId)
            .OrderByDescending(h => h.CreatedAt)
            .ToListAsync();

        var result = homeworks.Select(h => new
        {
            id = h.Id,
            title = h.Title,
            status = h.Status,
            files = ParseFiles(h.Files),
            comment = h.Comment,
            teacherComment = h.TeacherComment,
            due = h.DueDate,
            testLink = h.TestLink
        }).ToList();

        return Ok(result);
    }

    [HttpGet("all")]
    public IActionResult GetAllHomework()
    {
        var homeworks = _context.Homeworks
            .OrderByDescending(h => h.CreatedAt)
            .ToList();

        var studentIds = homeworks.Select(h => h.StudentId).Distinct().ToList();
        var students = _context.User.Where(u => studentIds.Contains(u.Id)).ToDictionary(u => u.Id, u => u.Name ?? "");

        var result = homeworks.Select(h => new
        {
            id = h.Id,
            title = h.Title,
            status = h.Status,
            files = ParseFiles(h.Files),
            comment = h.Comment,
            teacherComment = h.TeacherComment,
            due = h.DueDate,
            studentId = h.StudentId,
            studentName = students.GetValueOrDefault(h.StudentId, ""),
            testLink = h.TestLink
        }).ToList();

        return Ok(result);
    }

    [HttpPost]
    public IActionResult CreateHomework([FromBody] CreateHomeworkDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            return BadRequest(new { message = "Название задания обязательно" });

        var student = _context.User.Find(dto.StudentId);
        if (student == null)
            return BadRequest(new { message = "Ученик не найден" });

        var homework = new Homework
        {
            StudentId = dto.StudentId,
            Title = dto.Title,
            Status = "new",
            DueDate = dto.DueDate,
            TestLink = dto.TestLink,
            CreatedAt = DateTime.UtcNow
        };

        _context.Homeworks.Add(homework);
        _context.SaveChanges();

        return Ok(new { id = homework.Id });
    }

    [HttpPatch("{id}")]
    public IActionResult UpdateHomework(int id, [FromBody] UpdateHomeworkDto dto)
    {
        var homework = _context.Homeworks.Find(id);
        if (homework == null)
            return NotFound(new { message = "Задание не найдено" });

        if (dto.Status != null)
            homework.Status = dto.Status;
        if (dto.TestLink != null)
            homework.TestLink = dto.TestLink;
        if (dto.Comment != null)
            homework.Comment = dto.Comment;

        _context.SaveChanges();
        return Ok(new { id = homework.Id });
    }

    private static string[] ParseFiles(string? files)
    {
        if (string.IsNullOrWhiteSpace(files)) return Array.Empty<string>();
        try { return JsonSerializer.Deserialize<string[]>(files) ?? Array.Empty<string>(); }
        catch { return Array.Empty<string>(); }
    }
}

public class CreateHomeworkDto
{
    public int StudentId { get; set; }
    public string Title { get; set; } = "";
    public string? DueDate { get; set; }
    public string? TestLink { get; set; }
}

public class UpdateHomeworkDto
{
    public string? Status { get; set; }
    public string? TestLink { get; set; }
    public string? Comment { get; set; }
}

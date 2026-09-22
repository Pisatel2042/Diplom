using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly DBContext _context;

    public UsersController(DBContext context) { _context = context; }

    [HttpGet("students")]
    public IActionResult GetStudents()
    {
        var raw = _context.User
            .Where(u => u.Role == "student" || u.Role == "Student")
            .Select(u => new { u.Id, u.Name, u.AvatarUrl, u.Level, u.LevelLabel })
            .ToList();

        var students = raw.Select(u => new
        {
            id = u.Id,
            name = u.Name ?? "",
            avatar = u.AvatarUrl ?? (string.IsNullOrEmpty(u.Name) ? "?" : u.Name[..1]),
            level = u.Level ?? "",
            levelLabel = u.LevelLabel ?? ""
        }).ToList();

        return Ok(students);
    }
}

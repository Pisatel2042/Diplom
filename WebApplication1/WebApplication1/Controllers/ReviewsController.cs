using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly DBContext _context;

    public ReviewsController(DBContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetPublished()
    {
        return Ok(_context.Reviews.Where(r => r.IsPublished).OrderByDescending(r => r.Id).ToList());
    }

    [HttpGet("my")]
    [Authorize]
    public IActionResult GetMy()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
        if (userIdClaim == null) return Unauthorized();
        var userId = int.Parse(userIdClaim);

        return Ok(_context.Reviews.Where(r => r.UserId == userId).OrderByDescending(r => r.Id).ToList());
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateReviewDto dto)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
        if (userIdClaim == null) return Unauthorized();
        var userId = int.Parse(userIdClaim);

        var user = await _context.User.FindAsync(userId);
        if (user == null) return BadRequest(new { message = "Пользователь не найден" });

        var review = new Review
        {
            UserId = userId,
            StudentName = user.Name ?? "Аноним",
            LevelFrom = dto.LevelFrom ?? user.Level ?? "A1",
            LevelTo = dto.LevelTo ?? user.Level ?? "A1",
            Text = dto.Text ?? "",
            IsPublished = false
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Отзыв отправлен на модерацию", review });
    }
}

public class CreateReviewDto
{
    public string? Text { get; set; }
    public string? LevelFrom { get; set; }
    public string? LevelTo { get; set; }
}

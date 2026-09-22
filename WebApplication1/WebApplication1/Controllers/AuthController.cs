using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Services;
using WebApplication1.Models;
using System.Security.Cryptography;
using System.Text.Json;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly DBContext _context;
    private readonly JwtService _jwt;
    private readonly PasswordService _passswordService;
    
    public AuthController(DBContext context, JwtService jwt, PasswordService passwords)
    {
        _context = context;
        _jwt = jwt;
        _passswordService = passwords;
    }
    
    [HttpGet("me")]
    [Authorize]
    public IActionResult GetMe()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
        if (userIdClaim == null) return Unauthorized();
        var userId = int.Parse(userIdClaim);
        var user = _context.User.Find(userId);
        if (user == null) return NotFound(new { message = "Пользователь не найден" });

        string[]? goals = null;
        if (!string.IsNullOrEmpty(user.Goals))
        {
            try { goals = JsonSerializer.Deserialize<string[]>(user.Goals); } catch { }
        }

        return Ok(new
        {
            id = user.Id,
            name = user.Name,
            email = user.Email,
            role = user.Role,
            level = user.Level ?? "A1",
            levelLabel = user.LevelLabel ?? "Beginner",
            goals = goals ?? Array.Empty<string>(),
            avatar = user.Name?.Length > 0 ? user.Name[..1] : "?",
            lessonsCompleted = user.LessonsCompleted,
            lessonsTotal = user.LessonsTotal,
            rank = user.Rank,
            phone = user.Phone,
            telegram = user.Telegram,
            avatarUrl = user.AvatarUrl
        });
    }

    [HttpPost("google")]
    public IActionResult GoogleLogin([FromBody] GoogleLoginDto dto)
    {
        if (!string.IsNullOrEmpty(dto.IdToken) &&
            (string.IsNullOrEmpty(dto.GoogleId) || string.IsNullOrEmpty(dto.Email)))
        {
            var payload = DecodeGoogleIdToken(dto.IdToken);
            if (payload == null)
                return BadRequest(new { message = "Некорректный токен Google" });

            dto.GoogleId ??= payload.GoogleId;
            dto.Email ??= payload.Email;
            dto.Name ??= payload.Name;
            dto.AvatarUrl ??= payload.AvatarUrl;
        }

        if (string.IsNullOrEmpty(dto.GoogleId) || string.IsNullOrEmpty(dto.Email))
            return BadRequest(new { message = "Некорректные данные от Google" });

        var user = _context.User.FirstOrDefault(u => u.GoogleId == dto.GoogleId);
        if (user == null)
        {
            user = new User
            {
                Name = dto.Name ?? "Пользователь",
                Email = dto.Email,
                GoogleId = dto.GoogleId,
                GoogleAvatarUrl = dto.AvatarUrl,
                Role = "Student",
                IsActive = true
            };
            _context.User.Add(user);
            _context.SaveChanges();
        }

        var userId = user.Id.ToString();
        var token = _jwt.GenerateToken(userId, user.Role);
        return Ok(new { token, userId });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login( [FromBody] LoginDto dto, [FromServices] RecaptchaService recaptcha)
    {
        bool captchaValid = await recaptcha.ValidateAsync(dto.Captcha);
        if (!captchaValid)
            return BadRequest(new { message = "Подозрительная активность. Капча не пройдена." });
        
        var user = _context.User.FirstOrDefault(u => u.Email == dto.Email);

        if (user == null || string.IsNullOrEmpty(user.PasswordHash) ||
            !_passswordService.VerifyPassword(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Неверный логин или пароль" });

        var userId = user.Id.ToString();
        var token = _jwt.GenerateToken(userId, user.Role);

        return Ok(new { token, userId });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        var user = await _context.User.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
            return Ok(new { message = "Если такой email существует, ссылка отправлена" });

        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        var resetToken = new PasswordResetToken
        {
            Email = dto.Email,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            Used = false
        };

        _context.PasswordResetTokens.Add(resetToken);
        await _context.SaveChangesAsync();

        // In production, send email with link: domain.com/reset-password?token={token}
        // For dev, return token so frontend can show the reset link
        return Ok(new { message = "Ссылка отправлена на ваш email", devToken = token });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        var resetToken = await _context.PasswordResetTokens
            .FirstOrDefaultAsync(t => t.Token == dto.Token && !t.Used && t.ExpiresAt > DateTime.UtcNow);

        if (resetToken == null)
            return BadRequest(new { message = "Недействительная или истёкшая ссылка" });

        var user = await _context.User.FirstOrDefaultAsync(u => u.Email == resetToken.Email);
        if (user == null)
            return BadRequest(new { message = "Пользователь не найден" });

        user.PasswordHash = _passswordService.HashPassword(dto.Password);
        resetToken.Used = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Пароль успешно изменён" });
    }

    private static GoogleTokenPayload? DecodeGoogleIdToken(string idToken)
    {
        try
        {
            var parts = idToken.Split('.');
            if (parts.Length < 2) return null;

            var payload = parts[1]
                .Replace('-', '+')
                .Replace('_', '/');
            payload = payload.PadRight(payload.Length + (4 - payload.Length % 4) % 4, '=');

            using var doc = JsonDocument.Parse(Convert.FromBase64String(payload));
            var root = doc.RootElement;

            return new GoogleTokenPayload
            {
                GoogleId = root.GetProperty("sub").GetString(),
                Email = root.TryGetProperty("email", out var email) ? email.GetString() : null,
                Name = root.TryGetProperty("name", out var name) ? name.GetString() : null,
                AvatarUrl = root.TryGetProperty("picture", out var picture) ? picture.GetString() : null
            };
        }
        catch
        {
            return null;
        }
    }
}

public class GoogleTokenPayload
{
    public string? GoogleId { get; set; }
    public string? Email { get; set; }
    public string? Name { get; set; }
    public string? AvatarUrl { get; set; }
}

public class ForgotPasswordDto
{
    public string? Email { get; set; }
}

public class ResetPasswordDto
{
    public string? Token { get; set; }
    public string? Password { get; set; }
}
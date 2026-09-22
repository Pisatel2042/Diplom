using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/auth")]
public class ForgotPasswordController : ControllerBase
{
    private readonly DBContext _context;
    private readonly PasswordService _passwordService;
    private readonly EmailService _emailService;

    public ForgotPasswordController(
        DBContext context,
        PasswordService passwordService,
        EmailService emailService)
    {
        _context = context;
        _passwordService = passwordService;
        _emailService = emailService;
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        var user = await _context.User
            .FirstOrDefaultAsync(x => x.Email == dto.Email);

        if (user == null)
        {
            return BadRequest(new
            {
                message = "Пользователь не найден"
            });
        }

        var newPassword = GeneratePassword();

        user.PasswordHash = _passwordService.HashPassword(newPassword);

        await _context.SaveChangesAsync();

        await _emailService.SendNewPasswordAsync(
            user.Email!,
            newPassword
        );

        return Ok(new
        {
            message = "Новый пароль отправлен на почту"
        });
    }
    private static string GeneratePassword()
    {
        const string chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        var random = new Random();

        return new string(
            Enumerable.Range(0, 10)
                .Select(x => chars[random.Next(chars.Length)])
                .ToArray()
        );
    }
    
}


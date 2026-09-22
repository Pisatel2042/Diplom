using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Services;
using WebApplication1.Models;
using System.Security.Cryptography;
using Google.Apis.Auth;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/auth")]
public class RegisterController : ControllerBase
{
    private readonly DBContext _context;
    private readonly JwtService _jwt;
    private readonly PasswordService _passwordService;
    private readonly EmailService _emailService;
    private readonly IConfiguration _configuration;

    public RegisterController(
        DBContext context,
        JwtService jwt,
        PasswordService passwordService,
        EmailService emailService,
        IConfiguration configuration)
    {
        _context = context;
        _jwt = jwt;
        _passwordService = passwordService;
        _emailService = emailService;
        _configuration = configuration;
    }
    
    
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (dto == null)
            return BadRequest(new { message = "Некорректное тело запроса" });

        var user = await _context.User
            .FirstOrDefaultAsync(x => x.Email == dto.Email);

        var code = GenerateCode();

        if (user != null)
        {
            if (user.EmailConfirmed)
            {
                return BadRequest(new
                {
                    message = "Пользователь уже существует"
                });
            }

            user.Name = dto.Name;
            user.PasswordHash = _passwordService.HashPassword(dto.Password);
            user.Phone = dto.Phone;
            user.Telegram = dto.Telegram;
            user.VerificationCode = code;
            user.VerificationExpires = DateTime.UtcNow.AddMinutes(10);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }

            await _emailService.SendVerificationCodeAsync(user.Email!, code);

            return Ok(new
            {
                userId = user.Id
            });
        }

        user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = _passwordService.HashPassword(dto.Password),
            Phone = dto.Phone,
            Telegram = dto.Telegram,
            Role = "Student",
            EmailConfirmed = false,
            VerificationCode = code,
            VerificationExpires = DateTime.UtcNow.AddMinutes(10)
        };

        _context.User.Add(user);

        await _context.SaveChangesAsync();

        await _emailService.SendVerificationCodeAsync(user.Email!, code);

        return Ok(new
        {
            userId = user.Id
        });
    }

    [HttpPost("verify-code")]
    public async Task<IActionResult> VerifyCode([FromBody] VerifyCodeDto dto)
    {
        var user = await _context.User
            .FirstOrDefaultAsync(x => x.Id == dto.UserId);

        if (user == null)
        {
            return BadRequest(new
            {
                message = "Пользователь не найден"
            });
        }

        if (user.VerificationCode != dto.Code)
        {
            return BadRequest(new
            {
                message = "Неверный код"
            });
        }

        if (user.VerificationExpires < DateTime.UtcNow)
        {
            return BadRequest(new
            {
                message = "Срок действия кода истёк"
            });
        }

        user.EmailConfirmed = true;
        user.VerificationCode = null;
        user.VerificationExpires = null;

        await _context.SaveChangesAsync();

        var token = _jwt.GenerateToken(
            user.Id.ToString(),
            user.Role
        );

        return Ok(new
        {
            token,
            userId = user.Id
        });
    }

    [HttpPost("resend-code")]
    public async Task<IActionResult> ResendCode([FromBody] ResendCodeDto dto)
    {
        var user = await _context.User
            .FirstOrDefaultAsync(x => x.Id == dto.UserId);

        if (user == null)
        {
            return BadRequest(new
            {
                message = "Пользователь не найден"
            });
        }

        if (user.EmailConfirmed)
        {
            return BadRequest(new
            {
                message = "Email уже подтвержден"
            });
        }

        var code = GenerateCode();

        user.VerificationCode = code;
        user.VerificationExpires = DateTime.UtcNow.AddMinutes(10);

        await _context.SaveChangesAsync();

        await _emailService.SendVerificationCodeAsync(
            user.Email!,
            code
        );

        return Ok(new
        {
            message = "Код отправлен повторно"
        });
    }
    private static string GenerateCode()
    {
        return RandomNumberGenerator.GetInt32(100000, 999999).ToString();
    }
    
    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.IdToken))
            {
                return BadRequest(new { message = "IdToken не передан" });
            }
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[]
                {
                    _configuration["Google:ClientId"]
                }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(
                dto.IdToken,
                settings
            );

            var user = await _context.User
                .FirstOrDefaultAsync(x => x.Email == payload.Email);

            if (user == null)
            {
                user = new User
                {
                    Name = payload.Name,
                    Email = payload.Email,
                    PasswordHash = "",
                    Phone = "",
                    Telegram = "",
                    Role = "Student",
                    EmailConfirmed = true,
                    AvatarUrl = payload.Picture
                };

                _context.User.Add(user);
                await _context.SaveChangesAsync();
            }

            var token = _jwt.GenerateToken(user.Id.ToString(), user.Role);

            return Ok(new
            {
                token,
                userId = user.Id
            });
        }
        catch
        {
            return BadRequest(new
            {
                message = "Недействительный Google Token"
            });
        }
    }
}

public class VerifyCodeDto
{
    public int UserId { get; set; }
    public string Code { get; set; } = "";
}

public class ResendCodeDto
{
    public int UserId { get; set; }
}

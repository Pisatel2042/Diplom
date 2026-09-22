using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace WebApplication1.Services;

public class EmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendVerificationCodeAsync(string toEmail, string code)
    {
        var smtpHost = _config["Smtp:Host"];
        var smtpPort = _config["Smtp:Port"];
        var smtpUser = _config["Smtp:Username"];
        var smtpPass = _config["Smtp:Password"];
        var fromEmail = _config["Smtp:From"];

        if (!string.IsNullOrEmpty(smtpHost))
        {
            try
            {
                using var client = new SmtpClient();

                int port = 587;
                if (int.TryParse(smtpPort, out var parsedPort))
                    port = parsedPort;

                await client.ConnectAsync(smtpHost, port, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(smtpUser, smtpPass);

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("English.Pro", fromEmail ?? smtpUser));
                message.To.Add(new MailboxAddress("", toEmail));
                message.Subject = "Код подтверждения — English.Pro";

                var body = new TextPart("html")
                {
                    Text = $"<h2>Ваш код подтверждения:</h2><h1 style=\"color:#ff6b6b\">{code}</h1><p>Код действителен 10 минут.</p>"
                };
                message.Body = body;

                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation("Письмо успешно отправлено на {Email}", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка отправки письма на {Email} — код: {Code}", toEmail, code);
            }
        }
        else
        {
            _logger.LogWarning("SMTP not configured. Verification code for {Email}: {Code}", toEmail, code);
        }
    }
    
    
    public async Task SendNewPasswordAsync(string email, string password) 
    { try 
        { using var client = new SmtpClient(); 
            await client.ConnectAsync( _config["Smtp:Host"], int.Parse(_config["Smtp:Port"]!), SecureSocketOptions.StartTls ); 
            await client.AuthenticateAsync( _config["Smtp:Username"], _config["Smtp:Password"] ); 
            var message = new MimeMessage(); 
            message.From.Add( new MailboxAddress( "English.Pro", _config["Smtp:From"] ) );
            message.To.Add( MailboxAddress.Parse(email) ); message.Subject = "Восстановление пароля";
            message.Body = new TextPart("html") 
                { Text = $@" <h2>English.Pro</h2> <p>Ваш новый пароль:</p> <h1 style='color:#ff6b6b'> {password} 
                    </h1> <p>После входа рекомендуем сменить пароль.</p>" }; 
            await client.SendAsync(message); await client.DisconnectAsync(true); _logger.LogInformation("Новый пароль отправлен на {Email}", email); } 
        catch (Exception ex) { _logger.LogError(ex, "Ошибка отправки нового пароля"); throw; } }
    
    
}

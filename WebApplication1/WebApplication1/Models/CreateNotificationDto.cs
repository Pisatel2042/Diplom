namespace WebApplication1.Models;

public class CreateNotificationDto
{
    public int UserId { get; set; }

    public string? Text { get; set; }

    public string? Type { get; set; }
}
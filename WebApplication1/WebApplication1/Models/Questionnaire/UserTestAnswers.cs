namespace WebApplication1.Models.Questionnaire;

public class UserTestAnswers
{
    public int Id { get; set; }
    public string SessionId { get; set; }
    public int? UserId { get; set; }
    public int QuestionId { get; set; }
    public string AnswerText { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
}
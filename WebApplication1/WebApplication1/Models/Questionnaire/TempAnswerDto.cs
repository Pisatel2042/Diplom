namespace WebApplication1.Models.Questionnaire;

public class TempAnswerDto
{
    public string  SessionId { get; set; }
    public int QuestionId { get; set; }
    public string Answer { get; set; }
}
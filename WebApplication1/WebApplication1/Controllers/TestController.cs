using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Services;
using WebApplication1.Models;
using WebApplication1.Models.Questionnaire;


namespace WebApplication1.Controllers;




[ApiController]
[Route("api/test")]
public class TestController :  ControllerBase
{
    private readonly DBContext _context;

    public TestController(DBContext context)
    {
        _context = context;
    }
    
    
    
    [HttpGet("questions")]
    public IActionResult GetQuestions()
    {
        var questions = _context.TestQuestions
            .Select(q => new {
                id = q.Id,
                questionText = q.QuestionText,
                options = _context.TestOptions
                    .Where(o => o.QuestionId == q.Id)
                    .Select(o => o.OptionText)
                    .ToList()
            })
            .ToList();

        return Ok(questions);
    }


     
    [HttpPost("save-temp-answer")]
    public IActionResult SaveTempAnswer(TempAnswerDto dto)
    {
        _context.UserTestAnswers.Add(new UserTestAnswers()
        {
            SessionId = dto.SessionId,
            QuestionId = dto.QuestionId,
            AnswerText = dto.Answer
        });

        _context.SaveChanges();
        return Ok();
    }
    
    [HttpPost("attach-to-user")] // Привязка временных ответов к пользователю
    public IActionResult AttachToUser(AttachDto dto)
    {
        var answers = _context.UserTestAnswers
            .Where(a => a.SessionId == dto.SessionId)
            .ToList();

        foreach (var ans in answers)
            ans.UserId = dto.UserId;

        _context.SaveChanges();
        return Ok();
    }
    
    
    
     
}






namespace WebApplication1.Contracts;

public record GetNotesRequest(string? Search , string? SortItem, string? SortOrder)
{
    
}
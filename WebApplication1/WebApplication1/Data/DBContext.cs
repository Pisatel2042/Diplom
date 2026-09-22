using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using WebApplication1.Models.Questionnaire;

namespace WebApplication1.Data;

public class DBContext : DbContext
{
    public DBContext(DbContextOptions<DBContext> options) : base(options)
    {
        
    }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<User> User { get; set; }
    public DbSet<TestQuestions> TestQuestions { get; set; }
    public DbSet<UserTestAnswers> UserTestAnswers { get; set; }
    public DbSet<TestOptions> TestOptions { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<Homework> Homeworks { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
    public DbSet<StudentSchedule> StudentSchedules { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<PendingRegistration> PendingRegistrations { get; set; }
    public DbSet<EmailVerificationCode> EmailVerificationCodes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Lesson>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(l => l.StudentId)
            .HasConstraintName("FK_Lessons_Student")
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Lesson>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(l => l.TeacherId)
            .HasConstraintName("FK_Lessons_Teacher")
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Payment>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .HasConstraintName("FK_Payments_User")
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.Property(p => p.Amount).HasColumnType("decimal(18,2)");
        });
    }
}

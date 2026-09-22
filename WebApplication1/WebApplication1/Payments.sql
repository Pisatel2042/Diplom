-- ============================================================
-- 1. Create Payments table
-- Вставь этот код в Program.cs внутрь using (var scope ...),
-- после создания таблицы Notifications, перед catch { }
-- ============================================================
db.Database.ExecuteSqlRaw(
    "IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE name = 'Payments' AND type = 'U') " +
    "CREATE TABLE [dbo].[Payments] (" +
    "  [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY," +
    "  [UserId] INT NOT NULL," +
    "  [Amount] DECIMAL(18,2) NOT NULL," +
    "  [LessonCount] INT NOT NULL DEFAULT 0," +
    "  [Status] NVARCHAR(50) NOT NULL DEFAULT 'paid'," +
    "  [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE())");

-- ============================================================
-- 2. Add DbSet to DBContext.cs
-- Добавь строку в класс DBContext:
--   public DbSet<Payment> Payments { get; set; }
-- ============================================================

/* ============================================================
   English.Pro — Database Schema for MSSQL
   Description: Schema for an individual English tutor platform
   Author: Teacher
   ============================================================ */

-- ============================================================
-- 1. USERS (students + teacher)
-- ============================================================
CREATE TABLE [dbo].[Users] (
    [Id]             INT              IDENTITY(1,1) NOT NULL,
    [Name]           NVARCHAR(100)    NOT NULL,
    [Email]          NVARCHAR(255)    NOT NULL,
    [PasswordHash]   NVARCHAR(512)    NOT NULL,
    [Role]           NVARCHAR(20)     NOT NULL DEFAULT N'student',  -- 'student' | 'teacher'
    [Phone]          NVARCHAR(30)     NULL,
    [Telegram]       NVARCHAR(100)    NULL,
    [AvatarUrl]      NVARCHAR(500)    NULL,
    [IsActive]       BIT              NOT NULL DEFAULT 1,
    [CreatedAt]      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [UQ_Users_Email] UNIQUE ([Email])
);

CREATE NONCLUSTERED INDEX [IX_Users_Role] ON [dbo].[Users] ([Role])
    INCLUDE ([Name], [Email], [IsActive]);

-- ============================================================
-- 2. STUDENT PROFILES
-- ============================================================
CREATE TABLE [dbo].[StudentProfiles] (
    [Id]               INT              IDENTITY(1,1) NOT NULL,
    [UserId]           INT              NOT NULL,
    [Level]            NVARCHAR(10)     NOT NULL DEFAULT N'A1',   -- A1, A2, B1, B2, C1, C2
    [LevelLabel]       NVARCHAR(50)     NULL,
    [Xp]               INT              NOT NULL DEFAULT 0,
    [Streak]           INT              NOT NULL DEFAULT 0,
    [LessonsCompleted] INT              NOT NULL DEFAULT 0,
    [LessonsTotal]     INT              NOT NULL DEFAULT 0,
    [Rank]             INT              NOT NULL DEFAULT 1,
    [AvatarColor]      NVARCHAR(7)      NULL DEFAULT N'#6366f1',
    [CreatedAt]        DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]        DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_StudentProfiles] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_StudentProfiles_Users] FOREIGN KEY ([UserId])
        REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE,
    CONSTRAINT [UQ_StudentProfiles_UserId] UNIQUE ([UserId])
);

CREATE NONCLUSTERED INDEX [IX_StudentProfiles_Level] ON [dbo].[StudentProfiles] ([Level])
    INCLUDE ([UserId], [Xp], [Streak], [LessonsCompleted]);

-- ============================================================
-- 3. STUDENT GOALS
-- ============================================================
CREATE TABLE [dbo].[StudentGoals] (
    [Id]            INT              IDENTITY(1,1) NOT NULL,
    [StudentId]     INT              NOT NULL,
    [Goal]          NVARCHAR(500)    NOT NULL,
    [SortOrder]     INT              NOT NULL DEFAULT 0,
    [CreatedAt]     DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_StudentGoals] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_StudentGoals_StudentProfiles] FOREIGN KEY ([StudentId])
        REFERENCES [dbo].[StudentProfiles]([Id]) ON DELETE CASCADE
);

-- ============================================================
-- 4. STUDENT SKILLS (grammar, speaking, listening, writing)
-- ============================================================
CREATE TABLE [dbo].[StudentSkills] (
    [Id]            INT              IDENTITY(1,1) NOT NULL,
    [StudentId]     INT              NOT NULL,
    [SkillName]     NVARCHAR(50)     NOT NULL,  -- grammar, speaking, listening, writing
    [Value]         TINYINT          NOT NULL DEFAULT 0,  -- 0–100
    [CreatedAt]     DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]     DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_StudentSkills] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_StudentSkills_StudentProfiles] FOREIGN KEY ([StudentId])
        REFERENCES [dbo].[StudentProfiles]([Id]) ON DELETE CASCADE,
    CONSTRAINT [UQ_StudentSkills_Student_Skill] UNIQUE ([StudentId], [SkillName]),
    CONSTRAINT [CK_StudentSkills_Value] CHECK ([Value] BETWEEN 0 AND 100)
);

-- ============================================================
-- 5. LESSONS / SCHEDULE
-- ============================================================
CREATE TABLE [dbo].[Lessons] (
    [Id]             INT              IDENTITY(1,1) NOT NULL,
    [StudentId]      INT              NOT NULL,
    [TeacherId]      INT              NOT NULL,
    [Date]           DATE             NOT NULL,
    [Time]           TIME(0)          NOT NULL,
    [Topic]          NVARCHAR(300)    NOT NULL,
    [Status]         NVARCHAR(20)     NOT NULL DEFAULT N'upcoming',  -- upcoming | done | cancelled | rescheduled
    [RescheduleNote] NVARCHAR(500)    NULL,
    [MeetingLink]    NVARCHAR(500)    NULL,
    [RecordingUrl]   NVARCHAR(500)    NULL,
    [TeacherNotes]   NVARCHAR(MAX)   NULL,
    [CreatedAt]      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_Lessons] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_Lessons_Student] FOREIGN KEY ([StudentId])
        REFERENCES [dbo].[StudentProfiles]([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Lessons_Teacher] FOREIGN KEY ([TeacherId])
        REFERENCES [dbo].[Users]([Id]) ON DELETE NO ACTION
);

CREATE NONCLUSTERED INDEX [IX_Lessons_Date] ON [dbo].[Lessons] ([Date] DESC)
    INCLUDE ([StudentId], [TeacherId], [Time], [Topic], [Status]);

CREATE NONCLUSTERED INDEX [IX_Lessons_StudentId_Status] ON [dbo].[Lessons] ([StudentId], [Status])
    INCLUDE ([Date], [Time], [Topic]);

-- ============================================================
-- 6. LESSON MATERIALS (PDFs, links, cards, exercises)
-- ============================================================
CREATE TABLE [dbo].[LessonMaterials] (
    [Id]        INT              IDENTITY(1,1) NOT NULL,
    [LessonId]  INT              NOT NULL,
    [FileName]  NVARCHAR(255)    NOT NULL,
    [FileUrl]   NVARCHAR(500)    NOT NULL,
    [Type]      NVARCHAR(20)     NOT NULL DEFAULT N'file',  -- file | link | card | exercise
    [CreatedAt] DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_LessonMaterials] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_LessonMaterials_Lessons] FOREIGN KEY ([LessonId])
        REFERENCES [dbo].[Lessons]([Id]) ON DELETE CASCADE
);

-- ============================================================
-- 7. HOMEWORK
-- ============================================================
CREATE TABLE [dbo].[Homework] (
    [Id]              INT              IDENTITY(1,1) NOT NULL,
    [StudentId]       INT              NOT NULL,
    [TeacherId]       INT              NOT NULL,
    [Title]           NVARCHAR(300)    NOT NULL,
    [Description]     NVARCHAR(MAX)   NULL,
    [Status]          NVARCHAR(20)     NOT NULL DEFAULT N'new',  -- new | in_progress | submitted | checked
    [DueDate]         DATE             NULL,
    [TeacherComment]  NVARCHAR(MAX)   NULL,
    [CreatedAt]       DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]       DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_Homework] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_Homework_Student] FOREIGN KEY ([StudentId])
        REFERENCES [dbo].[StudentProfiles]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Homework_Teacher] FOREIGN KEY ([TeacherId])
        REFERENCES [dbo].[Users]([Id]) ON DELETE NO ACTION
);

CREATE NONCLUSTERED INDEX [IX_Homework_Status] ON [dbo].[Homework] ([Status])
    INCLUDE ([StudentId], [Title], [DueDate]);

CREATE NONCLUSTERED INDEX [IX_Homework_StudentId] ON [dbo].[Homework] ([StudentId], [Status])
    INCLUDE ([Title], [DueDate]);

-- ============================================================
-- 8. HOMEWORK FILES (student submissions)
-- ============================================================
CREATE TABLE [dbo].[HomeworkFiles] (
    [Id]           INT              IDENTITY(1,1) NOT NULL,
    [HomeworkId]   INT              NOT NULL,
    [FileName]     NVARCHAR(255)    NOT NULL,
    [FileUrl]      NVARCHAR(500)    NOT NULL,
    [UploadedBy]   NVARCHAR(20)     NOT NULL DEFAULT N'student',  -- student | teacher
    [CreatedAt]    DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_HomeworkFiles] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_HomeworkFiles_Homework] FOREIGN KEY ([HomeworkId])
        REFERENCES [dbo].[Homework]([Id]) ON DELETE CASCADE
);

-- ============================================================
-- 9. NOTIFICATIONS
-- ============================================================
CREATE TABLE [dbo].[Notifications] (
    [Id]        INT              IDENTITY(1,1) NOT NULL,
    [UserId]    INT              NOT NULL,
    [Type]      NVARCHAR(30)     NOT NULL,  -- reschedule | comment | hw | lesson | reminder
    [Title]     NVARCHAR(200)    NULL,
    [Message]   NVARCHAR(MAX)   NOT NULL,
    [IsRead]    BIT              NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_Notifications] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_Notifications_Users] FOREIGN KEY ([UserId])
        REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE
);

CREATE NONCLUSTERED INDEX [IX_Notifications_UserId_IsRead] ON [dbo].[Notifications] ([UserId], [IsRead] DESC)
    INCLUDE ([Type], [Message], [CreatedAt]);

-- ============================================================
-- 10. REVIEWS (for landing page)
-- ============================================================
CREATE TABLE [dbo].[Reviews] (
    [Id]          INT              IDENTITY(1,1) NOT NULL,
    [StudentName] NVARCHAR(100)    NOT NULL,
    [LevelFrom]   NVARCHAR(10)     NOT NULL,
    [LevelTo]     NVARCHAR(10)     NOT NULL,
    [Text]        NVARCHAR(MAX)   NOT NULL,
    [IsPublished] BIT              NOT NULL DEFAULT 0,
    [CreatedAt]   DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_Reviews] PRIMARY KEY CLUSTERED ([Id])
);

CREATE NONCLUSTERED INDEX [IX_Reviews_Published] ON [dbo].[Reviews] ([IsPublished])
    INCLUDE ([StudentName], [LevelFrom], [LevelTo], [CreatedAt]);

-- ============================================================
-- 11. XP TRANSACTION LOG (for gamification)
-- ============================================================
CREATE TABLE [dbo].[XpTransactions] (
    [Id]          INT              IDENTITY(1,1) NOT NULL,
    [StudentId]   INT              NOT NULL,
    [Amount]      INT              NOT NULL,
    [Reason]      NVARCHAR(100)    NOT NULL,  -- lesson_completed | homework_done | streak_bonus | achievement
    [ReferenceId] INT              NULL,       -- optional link to lesson / homework
    [CreatedAt]   DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_XpTransactions] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_XpTransactions_StudentProfiles] FOREIGN KEY ([StudentId])
        REFERENCES [dbo].[StudentProfiles]([Id]) ON DELETE CASCADE
);

CREATE NONCLUSTERED INDEX [IX_XpTransactions_StudentId] ON [dbo].[XpTransactions] ([StudentId], [CreatedAt] DESC);

-- ============================================================
-- 12. ACHIEVEMENTS (gamification)
-- ============================================================
CREATE TABLE [dbo].[Achievements] (
    [Id]          INT              IDENTITY(1,1) NOT NULL,
    [Code]        NVARCHAR(50)     NOT NULL,  -- first_lesson, streak_7, level_b2, etc.
    [Title]       NVARCHAR(200)    NOT NULL,
    [Description] NVARCHAR(500)    NULL,
    [IconUrl]     NVARCHAR(500)    NULL,
    [XpReward]    INT              NOT NULL DEFAULT 0,

    CONSTRAINT [PK_Achievements] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [UQ_Achievements_Code] UNIQUE ([Code])
);

-- ============================================================
-- 13. STUDENT ACHIEVEMENTS (many-to-many)
-- ============================================================
CREATE TABLE [dbo].[StudentAchievements] (
    [Id]              INT              IDENTITY(1,1) NOT NULL,
    [StudentId]       INT              NOT NULL,
    [AchievementId]   INT              NOT NULL,
    [AchievedAt]      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_StudentAchievements] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_StudentAchievements_Student] FOREIGN KEY ([StudentId])
        REFERENCES [dbo].[StudentProfiles]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_StudentAchievements_Achievement] FOREIGN KEY ([AchievementId])
        REFERENCES [dbo].[Achievements]([Id]) ON DELETE CASCADE,
    CONSTRAINT [UQ_StudentAchievements] UNIQUE ([StudentId], [AchievementId])
);

-- ============================================================
-- INDEX: Full-text search for lessons & homework
-- ============================================================
CREATE NONCLUSTERED INDEX [IX_Lessons_Topic] ON [dbo].[Lessons] ([Topic])
    INCLUDE ([Date], [Status]);

CREATE NONCLUSTERED INDEX [IX_Homework_Title] ON [dbo].[Homework] ([Title])
    INCLUDE ([Status], [DueDate]);

-- ============================================================
-- SEED DATA: Default teacher account
-- Login:    teacher@english.pro / Admin123!
-- ============================================================
INSERT INTO [dbo].[Users] ([Name], [Email], [PasswordHash], [Role], [Phone], [Telegram])
VALUES (
    N'Преподаватель',
    N'teacher@english.pro',
    -- Password: Admin123!  (bcrypt hash — placeholder, replace in real app)
    N'$2a$11$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    N'teacher',
    N'+7 (999) 123-45-67',
    N'@english_teacher'
);

-- ============================================================
-- SEED DATA: Sample achievements
-- ============================================================
INSERT INTO [dbo].[Achievements] ([Code], [Title], [Description], [XpReward]) VALUES
    (N'first_lesson',   N'Первый шаг',        N'Провели первый урок',                         100),
    (N'streak_7',       N'Неделя без перерыва', N'Занимались 7 дней подряд',                   300),
    (N'streak_30',      N'Месяц регулярности', N'Занимались 30 дней подряд',                  1000),
    (N'level_b1',       N'Уровень B1',         N'Достигли уровня Intermediate',                500),
    (N'level_b2',       N'Уровень B2',         N'Достигли уровня Upper-Intermediate',          1000),
    (N'level_c1',       N'Уровень C1',         N'Достигли уровня Advanced',                    2000),
    (N'homework_10',    N'Прилежный ученик',   N'Выполнили 10 домашних заданий',               200),
    (N'lessons_50',     N'Полсотни уроков',    N'Провели 50 уроков',                           500),
    (N'perfect_week',   N'Идеальная неделя',   N'Выполнили все ДЗ за неделю вовремя',          400);

-- ============================================================
-- SEED DATA: Sample reviews for landing page
-- ============================================================
INSERT INTO [dbo].[Reviews] ([StudentName], [LevelFrom], [LevelTo], [Text], [IsPublished]) VALUES
    (N'Анна',   N'B1', N'B2', N'За 4 месяца подтянула грамматику и наконец заговорила. Очень комфортная атмосфера на уроках!', 1),
    (N'Максим', N'A2', N'B1', N'Готовился к собеседованию — уже через 2 месяца прошёл. Очень доволен!', 1),
    (N'Елена',  N'0',  N'A2', N'Начала с нуля, через полгода могу объясниться в поездке. Спасибо!', 1);

-- ============================================================
-- STORED PROCEDURE: Create a new lesson + send notification
-- ============================================================
GO
CREATE OR ALTER PROCEDURE [dbo].[usp_CreateLesson]
    @StudentId      INT,
    @TeacherId      INT,
    @Date           DATE,
    @Time           TIME(0),
    @Topic          NVARCHAR(300),
    @MeetingLink    NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @LessonId INT;
    DECLARE @UserId INT;

    -- Get the user ID from the student profile
    SELECT @UserId = [UserId] FROM [dbo].[StudentProfiles] WHERE [Id] = @StudentId;

    -- Insert lesson
    INSERT INTO [dbo].[Lessons] ([StudentId], [TeacherId], [Date], [Time], [Topic], [MeetingLink])
    VALUES (@StudentId, @TeacherId, @Date, @Time, @Topic, @MeetingLink);

    SET @LessonId = SCOPE_IDENTITY();

    -- Send notification to student
    INSERT INTO [dbo].[Notifications] ([UserId], [Type], [Title], [Message])
    VALUES (
        @UserId,
        N'lesson',
        N'Новый урок',
        CONCAT(N'Назначен урок на ', FORMAT(@Date, N'dd.MM.yyyy'), N' в ', FORMAT(@Time, N'H:mm'), N'. Тема: ', @Topic)
    );

    SELECT @LessonId AS [LessonId];
END;
GO

-- ============================================================
-- STORED PROCEDURE: Submit homework + notify teacher
-- ============================================================
GO
CREATE OR ALTER PROCEDURE [dbo].[usp_SubmitHomework]
    @HomeworkId INT,
    @StudentId  INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TeacherId INT;
    DECLARE @TeacherUserId INT;
    DECLARE @Title NVARCHAR(300);

    SELECT @TeacherId = [TeacherId], @Title = [Title]
    FROM [dbo].[Homework] WHERE [Id] = @HomeworkId;

    SELECT @TeacherUserId = [UserId]
    FROM [dbo].[StudentProfiles] WHERE [Id] = @StudentId;

    UPDATE [dbo].[Homework]
    SET [Status] = 'submitted', [UpdatedAt] = SYSUTCDATETIME()
    WHERE [Id] = @HomeworkId;

    INSERT INTO [dbo].[Notifications] ([UserId], [Type], [Title], [Message])
    VALUES (
        @TeacherUserId,
        N'hw',
        N'ДЗ сдано на проверку',
        CONCAT(N'Студент сдал задание: ', @Title)
    );
END;
GO

-- ============================================================
-- STORED PROCEDURE: Check homework + add XP to student
-- ============================================================
GO
CREATE OR ALTER PROCEDURE [dbo].[usp_CheckHomework]
    @HomeworkId     INT,
    @TeacherComment NVARCHAR(MAX) = NULL,
    @TeacherId      INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @StudentId INT;

    SELECT @StudentId = [StudentId] FROM [dbo].[Homework] WHERE [Id] = @HomeworkId;

    UPDATE [dbo].[Homework]
    SET [Status] = 'checked',
        [TeacherComment] = @TeacherComment,
        [UpdatedAt] = SYSUTCDATETIME()
    WHERE [Id] = @HomeworkId;

    -- Award XP
    UPDATE [dbo].[StudentProfiles]
    SET [Xp] = [Xp] + 100
    WHERE [Id] = @StudentId;

    INSERT INTO [dbo].[XpTransactions] ([StudentId], [Amount], [Reason], [ReferenceId])
    VALUES (@StudentId, 100, N'homework_done', @HomeworkId);
END;
GO

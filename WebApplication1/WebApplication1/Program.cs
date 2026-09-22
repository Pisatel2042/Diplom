using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddAuthorization();
builder.Services.AddDbContext<DBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });    
});

var key = builder.Configuration["Jwt:Key"];
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };

});
builder.Services.AddAuthorization();
builder.Services.AddSingleton<JwtService>();
builder.Services.AddSingleton<PasswordService>();
builder.Services.AddSingleton<RecaptchaService>();
builder.Services.AddScoped<EmailService>();


var app = builder.Build();



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Log unhandled exceptions and return JSON instead of crashing the request
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Unhandled exception on {Method} {Path}", context.Request.Method, context.Request.Path);

        if (!context.Response.HasStarted)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            var message = app.Environment.IsDevelopment()
                ? ex.Message
                : "Внутренняя ошибка сервера";
            await context.Response.WriteAsJsonAsync(new { message, detail = app.Environment.IsDevelopment() ? ex.ToString() : null });
        }
    }
});

// Custom CORS middleware — wraps the whole pipeline, re-adds headers after any exception
app.Use(async (context, next) =>
{
    // set CORS headers before downstream
    context.Response.Headers["Access-Control-Allow-Origin"] = "http://localhost:5173";
    context.Response.Headers["Access-Control-Allow-Credentials"] = "true";
    context.Response.Headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization";
    context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH";

    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        return;
    }

    try
    {
        await next();
    }
    finally
    {
        // re-apply CORS headers even if an exception occurred and DeveloperExceptionPage cleared them
        if (!context.Response.HasStarted)
        {
            context.Response.Headers["Access-Control-Allow-Origin"] = "http://localhost:5173";
            context.Response.Headers["Access-Control-Allow-Credentials"] = "true";
        }
    }
});

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
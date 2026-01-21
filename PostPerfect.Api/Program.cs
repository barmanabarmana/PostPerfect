using FastEndpoints;
using FastEndpoints.Swagger;
using PostPerfect.Api.Common.Extensions;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// FastEndpoints
builder.Services
    .AddFastEndpoints();

// Swagger for development
builder.Services.SwaggerDocument(o =>
{
    o.DocumentSettings = s =>
    {
        s.Title = "PostPerfectAPI";
        s.Version = "v1";
        s.Description = "AI-powered Instagram post generator";
    };
});

// Services
builder.Services.AddClaudeService(builder.Configuration);
// SPOTIFY API TEMPORARILY DISABLED - API access closed by Spotify
// builder.Services.AddSpotifyService(builder.Configuration);

// CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite default
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// HttpClient for Spotify (SPOTIFY DISABLED)
// builder.Services.AddHttpClient();

var app = builder.Build();

app.UseCors("Frontend");
app.UseFastEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi(c => c.Path = "/openapi/{documentName}.json");
    app.MapScalarApiReference(o =>
    {
        o.Title = $"Post Perfect {builder.Environment.EnvironmentName}";
        o.PersistentAuthentication = true;
    });
}

app.Run();
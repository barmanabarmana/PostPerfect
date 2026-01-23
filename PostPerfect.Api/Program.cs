using FastEndpoints;
using FastEndpoints.Swagger;
using CaptionIT.Api.Common.Extensions;
using Scalar.AspNetCore;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddFixedWindowLimiter("UserRateLimit", limiterOptions =>
    {
        limiterOptions.PermitLimit = 10;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = 0;
    });

    // Per-user (IP-based) rate limiting
    options.AddPolicy("PerUserLimit", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));
});

// FastEndpoints
builder.Services
    .AddFastEndpoints();

// Swagger for development
builder.Services.SwaggerDocument(o =>
{
    o.DocumentSettings = s =>
    {
        s.Title = "CaptionIT API";
        s.Version = "v1";
        s.Description = "AI-powered Instagram caption generator";
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
        var allowedOrigins = new List<string> { "http://localhost:5173" }; // Vite default

        // Add production frontend URL from environment variable
        var productionUrl = builder.Configuration["FrontendUrl"];
        if (!string.IsNullOrEmpty(productionUrl))
        {
            // Normalize the URL - ensure it doesn't have a trailing slash
            var normalizedUrl = productionUrl.TrimEnd('/');
            allowedOrigins.Add(normalizedUrl);

            // Also add both http and https versions if not explicitly specified
            if (normalizedUrl.StartsWith("http://"))
            {
                allowedOrigins.Add(normalizedUrl.Replace("http://", "https://"));
            }
            else if (normalizedUrl.StartsWith("https://"))
            {
                allowedOrigins.Add(normalizedUrl.Replace("https://", "http://"));
            }
        }

        // Log allowed origins for debugging
        Console.WriteLine($"CORS - Allowed Origins: {string.Join(", ", allowedOrigins)}");

        policy.WithOrigins(allowedOrigins.ToArray())
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// HttpClient for Spotify (SPOTIFY DISABLED)
// builder.Services.AddHttpClient();

var app = builder.Build();

app.UseCors("Frontend");
app.UseRateLimiter();
app.UseFastEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi(c => c.Path = "/openapi/{documentName}.json");
    app.MapScalarApiReference(o =>
    {
        o.Title = $"CaptionIT {builder.Environment.EnvironmentName}";
        o.PersistentAuthentication = true;
    });
}

app.Run();
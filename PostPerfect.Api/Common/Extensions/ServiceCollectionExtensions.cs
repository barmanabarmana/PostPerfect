using PostPerfect.Api.Services.Claude;
// SPOTIFY API TEMPORARILY DISABLED - API access closed by Spotify
// using PostPerfect.Api.Services.Spotify;

namespace PostPerfect.Api.Common.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddClaudeService(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<ClaudeOptions>(
            configuration.GetSection(ClaudeOptions.SectionName));

        services.AddScoped<IClaudeService, ClaudeService>();

        return services;
    }

    // SPOTIFY API TEMPORARILY DISABLED - API access closed by Spotify
    // Uncomment when API access is available again
    /*
    public static IServiceCollection AddSpotifyService(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<SpotifyOptions>(
            configuration.GetSection(SpotifyOptions.SectionName));

        services.AddMemoryCache();
        services.AddHttpClient<ISpotifyService, SpotifyService>();

        return services;
    }
    */
}

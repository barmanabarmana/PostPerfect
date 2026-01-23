// SPOTIFY API TEMPORARILY DISABLED - API access closed by Spotify
// Uncomment when API access is available again

/*
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace CaptionIT.Api.Services.Spotify;

public class SpotifyService : ISpotifyService
{
    private readonly HttpClient _httpClient;
    private readonly SpotifyOptions _options;
    private readonly IMemoryCache _cache;
    private readonly ILogger<SpotifyService> _logger;

    private const string TokenCacheKey = "spotify_access_token";

    public SpotifyService(
        HttpClient httpClient,
        IOptions<SpotifyOptions> options,
        IMemoryCache cache,
        ILogger<SpotifyService> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _cache = cache;
        _logger = logger;
    }

    public async Task<SpotifyTrack?> FindTrackAsync(
        string mood,
        List<string> keywords,
        CancellationToken ct = default)
    {
        var token = await GetAccessTokenAsync(ct);

        // Build search query: combine mood and keywords
        var searchTerms = new List<string> { mood };
        searchTerms.AddRange(keywords.Take(2));
        var query = string.Join(" ", searchTerms);

        _logger.LogInformation("Searching Spotify for: {Query}", query);

        var request = new HttpRequestMessage(HttpMethod.Get,
            $"{_options.ApiBaseUrl}/search?q={Uri.EscapeDataString(query)}&type=track&limit=20");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _httpClient.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync(ct);
        var searchResult = JsonSerializer.Deserialize<SpotifySearchResponse>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        // Find first track WITH a preview URL
        var trackWithPreview = searchResult?.Tracks?.Items?
            .FirstOrDefault(t => !string.IsNullOrEmpty(t.PreviewUrl));

        if (trackWithPreview is null)
        {
            _logger.LogWarning("No tracks with preview found for query: {Query}", query);
            return null;
        }

        return new SpotifyTrack(
            Id: trackWithPreview.Id,
            Name: trackWithPreview.Name,
            Artist: string.Join(", ", trackWithPreview.Artists.Select(a => a.Name)),
            AlbumName: trackWithPreview.Album.Name,
            AlbumArt: trackWithPreview.Album.Images.FirstOrDefault()?.Url ?? "",
            PreviewUrl: trackWithPreview.PreviewUrl,
            SpotifyUrl: trackWithPreview.ExternalUrls.Spotify,
            DurationMs: trackWithPreview.DurationMs
        );
    }

    private async Task<string> GetAccessTokenAsync(CancellationToken ct)
    {
        if (_cache.TryGetValue(TokenCacheKey, out string? cachedToken) && cachedToken is not null)
        {
            return cachedToken;
        }

        var credentials = Convert.ToBase64String(
            Encoding.UTF8.GetBytes($"{_options.ClientId}:{_options.ClientSecret}"));

        var request = new HttpRequestMessage(HttpMethod.Post, _options.TokenEndpoint);
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);
        request.Content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "client_credentials")
        });

        var response = await _httpClient.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync(ct);
        var tokenResponse = JsonSerializer.Deserialize<SpotifyTokenResponse>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        var token = tokenResponse?.AccessToken
            ?? throw new InvalidOperationException("Failed to get Spotify token");

        // Cache token for 55 minutes (expires in 60)
        _cache.Set(TokenCacheKey, token, TimeSpan.FromMinutes(55));

        return token;
    }
}

// Spotify API response models (internal)
internal record SpotifyTokenResponse(string AccessToken, string TokenType, int ExpiresIn);

internal record SpotifySearchResponse(SpotifyTracksContainer? Tracks);

internal record SpotifyTracksContainer(List<SpotifyTrackItem>? Items);

internal record SpotifyTrackItem(
    string Id,
    string Name,
    List<SpotifyArtist> Artists,
    SpotifyAlbum Album,
    string? PreviewUrl,
    SpotifyExternalUrls ExternalUrls,
    int DurationMs
);

internal record SpotifyArtist(string Name);

internal record SpotifyAlbum(string Name, List<SpotifyImage> Images);

internal record SpotifyImage(string Url, int Height, int Width);

internal record SpotifyExternalUrls(string Spotify);
*/

namespace Sidae.Commons.Settings;

public sealed class RateLimitingSettings
{
    public const string SectionName = "RateLimiting";

    public bool Enabled { get; set; } = true;
    public string? ClientPartitionHeader { get; set; }
    public int PermitLimitPerMinute { get; set; } = 100;
    public int SlidingSegments { get; set; } = 4;
    public int SlidingWindowQueueLimit { get; set; }
    public int GlobalConcurrencyPermitLimit { get; set; } = 50;
    public int GlobalConcurrencyQueueLimit { get; set; } = 20;
    public string[] ExemptPathPrefixes { get; set; } =
    [
        "/health",
        "/openapi",
        "/swagger",
        "/scalar"
    ];
}

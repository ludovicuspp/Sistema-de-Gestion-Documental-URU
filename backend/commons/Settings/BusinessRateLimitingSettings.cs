namespace Sidae.Commons.Settings;

public sealed class BusinessRateLimitingSettings
{
    public const string SectionName = "BusinessRateLimiting";

    public bool Enabled { get; set; }
    public string PlanClaimType { get; set; } = "plan";
    public string DefaultPlan { get; set; } = "free";
    public int FallbackPermitsPerMinute { get; set; } = 60;
    public string ApiKeyHeaderName { get; set; } = "X-Api-Key";
    public bool UseApiKeyWhenPresent { get; set; } = true;
    public int AnonymousPermitsPerMinute { get; set; } = 30;
    public string? ClientPartitionHeader { get; set; }
    public Dictionary<string, int> PlanPermitsPerMinute { get; set; } = new(StringComparer.OrdinalIgnoreCase)
    {
        ["free"] = 60,
        ["pro"] = 300,
        ["enterprise"] = 1200
    };
    public Dictionary<string, string> ApiKeyPlanMap { get; set; } = new(StringComparer.Ordinal);
    public string[] ExemptPathPrefixes { get; set; } =
    [
        "/health",
        "/openapi",
        "/swagger",
        "/scalar"
    ];
}

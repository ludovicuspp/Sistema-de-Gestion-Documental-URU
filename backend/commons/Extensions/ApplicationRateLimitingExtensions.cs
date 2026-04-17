namespace Sidae.Commons.Extensions;

using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Primitives;
using Sidae.Commons.Settings;

public static class ApplicationRateLimitingExtensions
{
    public static IServiceCollection AddSidaeRateLimiting(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(configuration);

        services.Configure<RateLimitingSettings>(
            configuration.GetSection(RateLimitingSettings.SectionName));

        var options = configuration
            .GetSection(RateLimitingSettings.SectionName)
            .Get<RateLimitingSettings>() ?? new RateLimitingSettings();

        // UseRateLimiter() exige AddRateLimiter en el contenedor; si Enabled=false igual hay que registrar
        // servicios (política sin efecto) porque UseSidaeRequestGuards y RequireRateLimiting siguen activos.
        services.AddRateLimiter(rateLimiterOptions =>
        {
            rateLimiterOptions.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            if (!options.Enabled)
            {
                rateLimiterOptions.AddPolicy(RateLimitPolicies.PerIp, _ =>
                    RateLimitPartition.GetNoLimiter<string>("rate-limiting-disabled"));
                return;
            }

            rateLimiterOptions.OnRejected = async (context, cancellationToken) =>
            {
                var httpContext = context.HttpContext;
                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                    httpContext.Response.Headers.RetryAfter = ((int)retryAfter.TotalSeconds).ToString();

                httpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                await httpContext.Response.WriteAsJsonAsync(
                    new { error = "Too Many Requests" },
                    cancellationToken);
            };

            rateLimiterOptions.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
            {
                if (IsExemptPath(httpContext.Request.Path, options.ExemptPathPrefixes))
                    return RateLimitPartition.GetNoLimiter<string>("exempt");

                return RateLimitPartition.GetConcurrencyLimiter(
                    "global",
                    _ => new ConcurrencyLimiterOptions
                    {
                        PermitLimit = options.GlobalConcurrencyPermitLimit,
                        QueueLimit = options.GlobalConcurrencyQueueLimit
                    });
            });

            rateLimiterOptions.AddPolicy(RateLimitPolicies.PerIp, httpContext =>
                RateLimitPartition.GetSlidingWindowLimiter(
                    ResolvePartitionKey(httpContext, options),
                    _ => new SlidingWindowRateLimiterOptions
                    {
                        PermitLimit = options.PermitLimitPerMinute,
                        Window = TimeSpan.FromMinutes(1),
                        SegmentsPerWindow = Math.Max(1, options.SlidingSegments),
                        QueueLimit = options.SlidingWindowQueueLimit
                    }));
        });

        return services;
    }

    private static bool IsExemptPath(PathString path, string[]? prefixes)
    {
        if (prefixes is not { Length: > 0 })
            return false;

        var value = path.Value ?? string.Empty;
        foreach (var prefix in prefixes)
        {
            if (string.IsNullOrWhiteSpace(prefix))
                continue;
            if (value.StartsWith(prefix.Trim(), StringComparison.OrdinalIgnoreCase))
                return true;
        }

        return false;
    }

    private static string ResolvePartitionKey(HttpContext context, RateLimitingSettings options)
    {
        if (!string.IsNullOrWhiteSpace(options.ClientPartitionHeader) &&
            context.Request.Headers.TryGetValue(options.ClientPartitionHeader, out var header) &&
            !StringValues.IsNullOrEmpty(header))
        {
            var first = header.ToString().Split(',')[0].Trim();
            if (!string.IsNullOrEmpty(first))
                return first;
        }

        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }
}

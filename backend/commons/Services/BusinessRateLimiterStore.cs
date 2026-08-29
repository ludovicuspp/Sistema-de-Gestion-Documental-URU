namespace Sidae.Commons.Services;

using System.Collections.Concurrent;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using Sidae.Commons.Settings;

public sealed class BusinessRateLimiterStore : IDisposable
{
    private readonly ConcurrentDictionary<string, RateLimiter> _limiters = new(StringComparer.Ordinal);
    private readonly IOptionsMonitor<BusinessRateLimitingSettings> _optionsMonitor;

    public BusinessRateLimiterStore(IOptionsMonitor<BusinessRateLimitingSettings> optionsMonitor)
    {
        _optionsMonitor = optionsMonitor ?? throw new ArgumentNullException(nameof(optionsMonitor));
    }

    public async ValueTask<bool> TryAcquireAsync(HttpContext context, CancellationToken cancellationToken)
    {
        var opt = _optionsMonitor.CurrentValue;
        var (partitionKey, permits) = ResolvePartition(context, opt);
        if (permits < 1)
            return false;

        var limiter = _limiters.GetOrAdd(
            partitionKey,
            _ => new SlidingWindowRateLimiter(
                new SlidingWindowRateLimiterOptions
                {
                    PermitLimit = permits,
                    Window = TimeSpan.FromMinutes(1),
                    SegmentsPerWindow = 4,
                    QueueLimit = 0
                }));

        using RateLimitLease lease = await limiter
            .AcquireAsync(1, cancellationToken)
            .ConfigureAwait(false);

        return lease.IsAcquired;
    }

    private static (string PartitionKey, int Permits) ResolvePartition(
        HttpContext context,
        BusinessRateLimitingSettings opt)
    {
        if (opt.UseApiKeyWhenPresent &&
            !string.IsNullOrWhiteSpace(opt.ApiKeyHeaderName) &&
            context.Request.Headers.TryGetValue(opt.ApiKeyHeaderName, out var apiKeyValues) &&
            !StringValues.IsNullOrEmpty(apiKeyValues))
        {
            var raw = apiKeyValues.ToString().Trim();
            if (raw.Length > 0)
            {
                var hash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(raw)))
                    .ToLowerInvariant();
                var plan = opt.ApiKeyPlanMap.TryGetValue(raw, out var mapped)
                    ? mapped
                    : opt.DefaultPlan;
                var permits = ResolvePermitsForPlan(opt, plan);
                return ($"k:{hash}|p:{plan}", permits);
            }
        }

        if (context.User.Identity?.IsAuthenticated == true)
        {
            var userKey = context.User.FindFirst("sub")?.Value
                ?? context.User.FindFirst("nameid")?.Value
                ?? context.User.FindFirst("email")?.Value
                ?? "unknown";
            var planClaim = context.User.Claims
                .FirstOrDefault(c => string.Equals(c.Type, opt.PlanClaimType, StringComparison.OrdinalIgnoreCase))
                ?.Value;
            var plan = string.IsNullOrWhiteSpace(planClaim) ? opt.DefaultPlan : planClaim.Trim();
            var permits = ResolvePermitsForPlan(opt, plan);
            return ($"u:{userKey}|p:{plan}", permits);
        }

        var ip = ResolveClientPartition(context, opt);
        return ($"a:{ip}", Math.Max(1, opt.AnonymousPermitsPerMinute));
    }

    private static int ResolvePermitsForPlan(BusinessRateLimitingSettings opt, string plan)
    {
        if (opt.PlanPermitsPerMinute.TryGetValue(plan, out var p) && p > 0)
            return p;
        if (opt.PlanPermitsPerMinute.TryGetValue(opt.DefaultPlan, out var d) && d > 0)
            return d;
        return Math.Max(1, opt.FallbackPermitsPerMinute);
    }

    private static string ResolveClientPartition(HttpContext context, BusinessRateLimitingSettings opt)
    {
        if (!string.IsNullOrWhiteSpace(opt.ClientPartitionHeader) &&
            context.Request.Headers.TryGetValue(opt.ClientPartitionHeader, out var header) &&
            !StringValues.IsNullOrEmpty(header))
        {
            var first = header.ToString().Split(',')[0].Trim();
            if (!string.IsNullOrEmpty(first))
                return first;
        }

        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }

    public void Dispose()
    {
        foreach (var pair in _limiters)
            pair.Value.Dispose();

        _limiters.Clear();
    }
}

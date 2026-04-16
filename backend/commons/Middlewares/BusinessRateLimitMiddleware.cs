namespace Sidae.Commons.Middlewares;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sidae.Commons.Services;
using Sidae.Commons.Settings;

public sealed class BusinessRateLimitMiddleware(
    RequestDelegate next,
    BusinessRateLimiterStore limiterStore,
    IOptions<BusinessRateLimitingSettings> options,
    ILogger<BusinessRateLimitMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var opt = options.Value;
        if (!opt.Enabled || !ShouldApply(context, opt))
        {
            await next(context);
            return;
        }

        var allowed = await limiterStore.TryAcquireAsync(context, context.RequestAborted).ConfigureAwait(false);
        if (!allowed)
        {
            logger.LogWarning(
                "Business rate limit exceeded. Path={Path} Method={Method}",
                context.Request.Path,
                context.Request.Method);
            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            await context.Response
                .WriteAsJsonAsync(new { error = "Too Many Requests", detail = "Business quota exceeded" }, context.RequestAborted)
                .ConfigureAwait(false);
            return;
        }

        await next(context);
    }

    private static bool ShouldApply(HttpContext context, BusinessRateLimitingSettings opt)
    {
        if (HttpMethods.IsOptions(context.Request.Method))
            return false;

        var path = context.Request.Path.Value ?? string.Empty;
        if (opt.ExemptPathPrefixes is { Length: > 0 })
        {
            foreach (var prefix in opt.ExemptPathPrefixes)
            {
                if (string.IsNullOrWhiteSpace(prefix))
                    continue;
                if (path.StartsWith(prefix.Trim(), StringComparison.OrdinalIgnoreCase))
                    return false;
            }
        }

        return path.StartsWith("/api", StringComparison.OrdinalIgnoreCase);
    }
}

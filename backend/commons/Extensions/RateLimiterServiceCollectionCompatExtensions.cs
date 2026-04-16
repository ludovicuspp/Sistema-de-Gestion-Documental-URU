namespace Microsoft.Extensions.DependencyInjection;

using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;

public static class RateLimiterServiceCollectionCompatExtensions
{
    public static IServiceCollection AddRateLimiter(
        this IServiceCollection services,
        Action<RateLimiterOptions> configureOptions)
    {
        services.AddOptions<RateLimiterOptions>().Configure(configureOptions);
        return services;
    }
}

namespace Sidae.Commons.Extensions;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sidae.Commons.Settings;
using Sidae.Commons.Services;

public static class BusinessRateLimitingExtensions
{
    public static IServiceCollection AddBusinessRateLimiting(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(configuration);

        services.Configure<BusinessRateLimitingSettings>(
            configuration.GetSection(BusinessRateLimitingSettings.SectionName));
        services.AddSingleton<BusinessRateLimiterStore>();

        return services;
    }
}

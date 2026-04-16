namespace Sidae.Commons.Extensions;

using Amazon.S3;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Settings;
using Sidae.Commons.Services;

public static class CloudflareR2StorageExtensions
{
    public static IServiceCollection AddCloudflareR2Storage(
        this IServiceCollection services,
        IConfiguration configuration,
        string? configurationSection = null)
    {
        var sectionName = configurationSection ?? CloudflareR2Settings.SectionName;
        var section = configuration.GetSection(sectionName);
        var cloudflareOptions = section.Get<CloudflareR2Settings>() ?? new CloudflareR2Settings();

        var accessKey = section["AccessKeyId"];
        var secretKey = section["SecretAccessKey"];
        var bucket = section["BucketName"];
        var accountId = section["AccountId"];
        var serviceUrl = section["ServiceUrl"];

        if (string.IsNullOrWhiteSpace(accessKey)
            || string.IsNullOrWhiteSpace(secretKey)
            || string.IsNullOrWhiteSpace(bucket))
        {
            services.AddSingleton(cloudflareOptions);
            services.AddScoped<ICloudflareR2StorageService, UnconfiguredCloudflareR2StorageService>();
            return services;
        }

        var resolvedUrl = ResolveServiceUrl(accountId, serviceUrl);
        if (resolvedUrl == null)
        {
            services.AddSingleton(cloudflareOptions);
            services.AddScoped<ICloudflareR2StorageService, UnconfiguredCloudflareR2StorageService>();
            return services;
        }

        services.AddSingleton<IAmazonS3>(_ =>
        {
            var cfg = new AmazonS3Config
            {
                ServiceURL = resolvedUrl,
                ForcePathStyle = true
            };

            return new AmazonS3Client(accessKey, secretKey, cfg);
        });

        cloudflareOptions.ServiceUrl = resolvedUrl;
        services.AddSingleton(cloudflareOptions);
        services.AddScoped<ICloudflareR2StorageService, CloudflareR2StorageService>();
        return services;
    }

    private static string? ResolveServiceUrl(string? accountId, string? serviceUrl)
    {
        if (!string.IsNullOrWhiteSpace(serviceUrl))
            return serviceUrl.Trim().TrimEnd('/');

        if (string.IsNullOrWhiteSpace(accountId))
            return null;

        return $"https://{accountId.Trim()}.r2.cloudflarestorage.com";
    }
}

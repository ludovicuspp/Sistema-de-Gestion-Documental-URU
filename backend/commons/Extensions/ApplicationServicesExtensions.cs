namespace Sidae.Commons.Extensions;

using Microsoft.Extensions.DependencyInjection;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Services;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddSidaeCommonsApplicationServices(this IServiceCollection services)
    {
        services.AddMemoryCache();
        services.AddSingleton<ICacheService, CacheService>();
        services.AddSidaeIdentity();
        services.AddScoped<IDocumentTypeService, DocumentTypeService>();
        return services;
    }
}

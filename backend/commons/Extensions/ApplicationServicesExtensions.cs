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
        services.AddScoped<IRecordFolderStatusService, RecordFolderStatusService>();
        services.AddScoped<IRecordFolderTypeService, RecordFolderTypeService>();
        services.AddScoped<IRecordPhysicalLocationService, RecordPhysicalLocationService>();
        services.AddScoped<IRecordFolderService, RecordFolderService>();
        services.AddScoped<IRecordObservationService, RecordObservationService>();
        services.AddScoped<IRequestStatusService, RequestStatusService>();
        services.AddScoped<IRequestItemService, RequestItemService>();
        services.AddScoped<IRequestDocumentTypeService, RequestDocumentTypeService>();
        return services;
    }
}

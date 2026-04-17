namespace Sidae.Sidae.Helpers;

/// <summary>
/// Claves y TTL por defecto para catálogos en caché.
/// </summary>
public static class CatalogCacheKey
{
    public const string DocumentTypesAll = "catalog:document-types:all";

    public const string RecordFolderStatusesAll = "catalog:record:folder-statuses:all";
    public const string RecordFolderTypesAll = "catalog:record:folder-types:all";
    public const string RecordPhysicalLocationsAll = "catalog:record:physical-locations:all";
    public const string RecordFoldersAll = "catalog:record:folders:all";
    public const string RecordObservationsAll = "catalog:record:observations:all";
    public const string RequestStatusesAll = "catalog:request:statuses:all";
    public const string RequestItemsAll = "catalog:request:items:all";
    public const string RequestDocumentTypesAll = "catalog:request:document-types:all";

    public static TimeSpan DefaultTtl => TimeSpan.FromMinutes(5);
}

namespace Sidae.Support.Helpers;

/// <summary>
/// Claves y TTL por defecto para catálogos en caché.
/// </summary>
public static class CatalogCacheKey
{
    public const string DocumentTypesAll = "catalog:document-types:all";
    public const string MimeTypesAll = "catalog:document:mime-types:all";

    public const string AcademicLevelsAll = "catalog:general:academic-levels:all";
    public const string CareersAll = "catalog:general:careers:all";

    public const string TaskStatusesAll = "catalog:task:statuses:all";
    public const string StudentStatusesAll = "catalog:student:statuses:all";

    public const string RecordFolderStatusesAll = "catalog:record:folder-statuses:all";
    public const string RecordFolderTypesAll = "catalog:record:folder-types:all";

    public const string RequestStatusesAll = "catalog:request:statuses:all";

    public static TimeSpan DefaultTtl => TimeSpan.FromMinutes(5);
}

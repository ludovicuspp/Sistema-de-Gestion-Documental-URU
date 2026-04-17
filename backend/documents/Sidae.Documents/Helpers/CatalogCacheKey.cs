namespace Sidae.Documents.Helpers;

/// <summary>
/// Claves y TTL por defecto para catálogos en caché.
/// </summary>
public static class CatalogCacheKey
{
    public const string DocumentTypesAll = "catalog:document-types:all";

    public const string AcademicLevelsAll = "catalog:general:academic-levels:all";
    public const string CareersAll = "catalog:general:careers:all";

    public static TimeSpan DefaultTtl => TimeSpan.FromMinutes(5);
}

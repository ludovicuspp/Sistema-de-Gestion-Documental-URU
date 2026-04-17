namespace Sidae.Sidae.Helpers;

/// <summary>
/// Claves y TTL por defecto para catálogos en caché.
/// </summary>
public static class CatalogCacheKey
{
    public const string DocumentTypesAll = "catalog:document-types:all";

    public static TimeSpan DefaultTtl => TimeSpan.FromMinutes(5);
}

namespace Sidae.Documents.Helpers;

/// <summary>
/// Claves y TTL por defecto para caché del API Documents.
/// </summary>
public static class CatalogCacheKey
{
    public const string DocumentEntriesAll = "catalog:document:entries:all";

    public static TimeSpan DefaultTtl => TimeSpan.FromMinutes(5);
}

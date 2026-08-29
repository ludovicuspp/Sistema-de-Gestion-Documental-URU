namespace Sidae.Security.Helpers;

/// <summary>
/// Claves y TTL por defecto para catálogos en caché.
/// </summary>
public static class CatalogCacheKey
{
    public const string SecurityActionsAll = "catalog:security:actions:all";
    public const string SecurityRolesAll = "catalog:security:roles:all";

    public static TimeSpan DefaultTtl => TimeSpan.FromMinutes(5);
}

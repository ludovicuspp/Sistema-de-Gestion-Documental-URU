namespace Sidae.Commons.Extensions;

using Microsoft.Extensions.Configuration;

/// <summary>
/// Resuelve la sección de cadena de conexión: <c>PostgreSQL</c> si tiene ConnectionString, si no <c>SQLServer</c> (compatibilidad).
/// </summary>
public static class DatabaseConfigurationExtensions
{
    public static IConfigurationSection GetAppDatabaseSection(this IConfiguration configuration)
    {
        var postgres = configuration.GetSection("PostgreSQL");
        if (!string.IsNullOrWhiteSpace(postgres["ConnectionString"]))
            return postgres;

        return configuration.GetSection("SQLServer");
    }
}

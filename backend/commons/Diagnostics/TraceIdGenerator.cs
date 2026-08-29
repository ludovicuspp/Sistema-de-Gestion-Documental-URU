namespace Sidae.Commons.Diagnostics;

/// <summary>
/// Genera identificadores únicos para correlación de peticiones / logs.
/// </summary>
public static class TraceIdGenerator
{
    public static string New() => Guid.NewGuid().ToString("N");
}

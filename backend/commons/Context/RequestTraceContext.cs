namespace Sidae.Commons.Context;

/// <summary>
/// Id de correlación de la petición HTTP actual (AsyncLocal). Lo rellena <see cref="Sidae.Commons.Middlewares.RequestTraceMiddleware"/>.
/// </summary>
public static class RequestTraceContext
{
    private static readonly AsyncLocal<string?> TraceIdLocal = new();

    /// <summary>Id de traza de la petición; null fuera del pipeline HTTP o antes del middleware.</summary>
    public static string? TraceId
    {
        get => TraceIdLocal.Value;
        set => TraceIdLocal.Value = value;
    }
}

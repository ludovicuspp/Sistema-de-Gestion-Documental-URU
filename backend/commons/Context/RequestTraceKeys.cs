namespace Sidae.Commons.Context;

/// <summary>
/// Nombres de cabeceras HTTP relacionadas con la traza de petición.
/// </summary>
public static class RequestTraceKeys
{
    /// <summary>Cabecera con el id de traza (entrada opcional; si falta se genera uno).</summary>
    public const string TraceHeaderName = "X-Trace-Id";
}

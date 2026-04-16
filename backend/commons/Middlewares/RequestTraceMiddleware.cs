namespace Sidae.Commons.Middlewares;

using Microsoft.AspNetCore.Http;
using Sidae.Commons.Context;
using Sidae.Commons.Diagnostics;

/// <summary>
/// Asigna <see cref="RequestTraceContext.TraceId"/> y propaga <see cref="RequestTraceKeys.TraceHeaderName"/> en la respuesta.
/// </summary>
public sealed class RequestTraceMiddleware
{
    private readonly RequestDelegate _next;

    public RequestTraceMiddleware(RequestDelegate next)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var incoming = context.Request.Headers[RequestTraceKeys.TraceHeaderName].FirstOrDefault();
        var traceId = string.IsNullOrWhiteSpace(incoming) ? TraceIdGenerator.New() : incoming.Trim();
        RequestTraceContext.TraceId = traceId;
        context.Response.Headers[RequestTraceKeys.TraceHeaderName] = traceId;

        try
        {
            await _next(context).ConfigureAwait(false);
        }
        finally
        {
            RequestTraceContext.TraceId = null;
        }
    }
}

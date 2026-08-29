namespace Sidae.Commons.Patterns;

using System.Text.Json.Serialization;
using Sidae.Commons.Context;

public class Result<T>
{
    public bool Ok { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Error? Error { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public T? Response { get; set; }

    public object? Trace { get; set; }

    [JsonConstructor]
    private Result(bool ok, Error? error, T? response, object? trace)
    {
        Ok = ok;
        Error = error;
        Response = response;
        Trace = trace;
    }

    private Result(bool ok, Error? error, T? response)
    {
        if ((ok && error != null && error != Error.None) || (!ok && (error == null || error == Error.None)))
            throw new ArgumentException("Invalid error", nameof(error));

        Ok = ok;
        Error = (ok ? null : error);
        Response = (ok ? response : default);
    }

    public static Result<T> Success()
    {
        var r = new Result<T>(true, null, default);
        r.Trace = RequestTraceContext.TraceId;
        return r;
    }

    public static Result<T> Success(T data, object? trace = null)
    {
        var r = new Result<T>(true, null, data);
        r.Trace = trace ?? RequestTraceContext.TraceId;
        return r;
    }

    public static Result<T> Failure(Error error, object? trace = null)
    {
        var r = new Result<T>(false, error, default);
        r.Trace = trace ?? RequestTraceContext.TraceId;
        return r;
    }

    public static Result<T> Accepted(Error error, object? trace = null)
    {
        var r = new Result<T>(true, null, default);
        r.Error = error;
        r.Trace = trace ?? RequestTraceContext.TraceId;
        return r;
    }
}
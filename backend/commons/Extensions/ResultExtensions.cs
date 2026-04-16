namespace Sidae.Commons.Extensions;

using Sidae.Commons.Patterns;

public static class ResultExtensions
{
    public static TResult Match<T, TResult>(
        this Result<T> result,
        Func<T?, TResult> onSuccess,
        Func<Error?, TResult> onFailure)
    {
        if (result.Ok)
            return onSuccess(result.Response);
        return onFailure(result.Error);
    }
}

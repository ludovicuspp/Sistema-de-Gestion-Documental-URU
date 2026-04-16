namespace Sidae.Commons.Middlewares;

using Microsoft.AspNetCore.Http;
using Sidae.Commons.Interfaces;

public sealed class UserIdentityMiddleware
{
    public const string HttpItemKey = "UserIdentity";
    private readonly RequestDelegate _next;

    public UserIdentityMiddleware(RequestDelegate next)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
    }

    public async Task InvokeAsync(HttpContext context, IUserIdentityService userIdentityService)
    {
        context.Items[HttpItemKey] = userIdentityService.GetCurrent();
        await _next(context).ConfigureAwait(false);
    }
}

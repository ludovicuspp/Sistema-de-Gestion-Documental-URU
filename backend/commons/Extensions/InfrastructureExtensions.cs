namespace Sidae.Commons.Extensions;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Services;

public static class InfrastructureExtensions
{
    public static IServiceCollection AddSidaeIdentity(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<IUserIdentityService, UserIdentityService>();
        return services;
    }

    public static IApplicationBuilder UseSidaeRequestGuards(this IApplicationBuilder app)
    {
        app.UseMiddleware<Sidae.Commons.Middlewares.BusinessRateLimitMiddleware>();
        app.UseRateLimiter();
        app.UseMiddleware<Sidae.Commons.Middlewares.UserIdentityMiddleware>();
        return app;
    }
}

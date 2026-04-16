using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Services;

namespace Sidae.Commons.Extensions;

public static class DbContextExtensions
{
    public static IServiceCollection AddAppDbContext(
        this IServiceCollection services,
        IConfigurationSection configuration,
        IHostEnvironment environment)
    {
        var connectionString = configuration["ConnectionString"] ?? string.Empty;
        var useNpgsql = configuration.GetValue("UseNpgsql", false)
            || connectionString.Contains("Host=", StringComparison.OrdinalIgnoreCase);

        void ConfigureOptions(DbContextOptionsBuilder options)
        {
            if (useNpgsql)
            {
                options.UseNpgsql(connectionString, npgsql =>
                    npgsql.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(10),
                        errorCodesToAdd: null));
            }
            else
            {
                options.UseSqlServer(connectionString, sqlOptions =>
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(10),
                        errorNumbersToAdd: null));
            }

            if (environment.IsDevelopment())
                options.LogTo(Console.WriteLine, LogLevel.Information);
        }

        services.AddHttpContextAccessor();
        services.AddScoped<AuditSaveChangesInterceptor>();

        services.AddDbContext<AppDbContext>((sp, options) =>
        {
            ConfigureOptions(options);
            options.AddInterceptors(sp.GetRequiredService<AuditSaveChangesInterceptor>());
        });

        services.AddScoped<ICurrentUserAccessor, CurrentUserAccessor>();

        return services;
    }
}

namespace Sidae.Migration;
using FluentMigrator.Runner;
using Microsoft.Extensions.DependencyInjection;
using Sidae.Migration.Migrations;
static class Program
{
    static void Main(string[] args)
    {
        // Connection string - update this with your database connection string
        string connectionString = args.Length > 0
            ? args[0]
            : "Host=localhost;Port=5432;Database=sidae_db;Username=postgres;Password=your_password;";

        IServiceProvider serviceProvider = CreateServices(connectionString);

        // Put the database update into a scope to ensure
        // that all resources will be disposed.
        using IServiceScope scope = serviceProvider.CreateScope();
        UpdateDatabase(scope.ServiceProvider);
    }

    /// <summary>
    /// Configure the dependency injection services
    /// </summary>
    private static ServiceProvider CreateServices(string connectionString)
    {
        return new ServiceCollection()
            // Add common FluentMigrator services
            .AddFluentMigratorCore()
            .ConfigureRunner(rb => rb
                // Add PostgreSQL support to FluentMigrator
                .AddPostgres()
                // Set the connection string
                .WithGlobalConnectionString(connectionString)
                // Define the assembly containing the migrations
                .ScanIn(typeof(SIDAE_DataModel_Add_Table).Assembly).For.Migrations())
            // Enable logging to console in the FluentMigrator way
            .AddLogging(lb => lb.AddFluentMigratorConsole())
            // Build the service provider
            .BuildServiceProvider(false);
    }

    /// <summary>
    /// Update the database
    /// </summary>
    private static void UpdateDatabase(IServiceProvider serviceProvider)
    {
        // Instantiate the runner
        IMigrationRunner runner = serviceProvider.GetRequiredService<IMigrationRunner>();

        // Execute the migrations
        runner.MigrateUp();
    }
}

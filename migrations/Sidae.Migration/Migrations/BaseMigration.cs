namespace Sidae.Migration.Migrations;
using FluentMigrator;
using System.IO;
using System.Reflection;


/// <summary>
/// Base migration class that provides common functionality for reading SQL script files.
/// Inherit from this class instead of Migration to use the ReadScriptFile method.
/// </summary>
public abstract class BaseMigration : Migration
{
    /// <summary>
    /// Reads a SQL script file from the Scripts folder.
    /// </summary>
    /// <param name="fileName">The name of the SQL file (e.g., "20240101000004_ExecuteScriptExample_Up.sql")</param>
    /// <returns>The contents of the SQL file as a string</returns>
    /// <exception cref="FileNotFoundException">Thrown when the script file is not found</exception>
    protected static string ReadScriptFile(string fileName)
    {
        Assembly assembly = Assembly.GetExecutingAssembly();
        string assemblyDirectory = Path.GetDirectoryName(assembly.Location) ?? string.Empty;
        string scriptPath = Path.Combine(assemblyDirectory, "Scripts", fileName);

        if (!File.Exists(scriptPath))
        {
            throw new FileNotFoundException($"Script file not found: {scriptPath}");
        }

        return File.ReadAllText(scriptPath);
    }
}


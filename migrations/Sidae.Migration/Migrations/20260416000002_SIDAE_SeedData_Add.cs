namespace Sidae.Migration.Migrations;
using FluentMigrator;

/// <summary>
/// Datos estáticos iniciales (seed). Agregar nuevos bloques en los scripts Up/Down asociados.
/// </summary>
[Migration(20260416000002)]
public class SIDAE_SeedData_Add : BaseMigration
{
    public override void Up()
    {
        string sql = ReadScriptFile("20260416000002_SIDAE_SeedData_Add_Up.sql");
        Execute.Sql(sql);
    }

    public override void Down()
    {
        string sql = ReadScriptFile("20260416000002_SIDAE_SeedData_Add_Down.sql");
        Execute.Sql(sql);
    }
}

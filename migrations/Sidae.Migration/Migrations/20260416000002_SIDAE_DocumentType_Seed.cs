namespace Sidae.Migration.Migrations;
using FluentMigrator;

[Migration(20260416000002)]
public class SIDAE_DocumentType_Seed : BaseMigration
{
    public override void Up()
    {
        string sql = ReadScriptFile("20260416000002_SIDAE_DocumentType_Seed_Up.sql");
        Execute.Sql(sql);
    }

    public override void Down()
    {
        string sql = ReadScriptFile("20260416000002_SIDAE_DocumentType_Seed_Down.sql");
        Execute.Sql(sql);
    }
}

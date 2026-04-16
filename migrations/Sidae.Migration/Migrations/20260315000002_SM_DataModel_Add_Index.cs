namespace Sidae.Migration.Migrations;
using FluentMigrator;

[Migration(20260315000002)]
public class SM_DataModel_Add_Index : BaseMigration
{
    public override void Up()
    {
        string sql = ReadScriptFile("20260315000002_SM_DataModel_Add_Index_Up.sql");
        Execute.Sql(sql);
    }

    public override void Down()
    {
        string sql = ReadScriptFile("20260315000002_SM_DataModel_Add_Index_Down.sql");
        Execute.Sql(sql);
    }
}

namespace Sidae.Migration.Migrations;
using FluentMigrator;

[Migration(20260315000003)]
public class SM_DataModel_Add_StaticData : BaseMigration
{
    public override void Up()
    {
        string sql = ReadScriptFile("20260315000003_SM_DataModel_Add_StaticData_Up.sql");
        Execute.Sql(sql);
    }

    public override void Down()
    {
        string sql = ReadScriptFile("20260315000003_SM_DataModel_Add_StaticData_Down.sql");
        Execute.Sql(sql);
    }
}

namespace Sidae.Migration.Migrations;
using FluentMigrator;

[Migration(20260315000001)]
public class SM_DataModel_Add_Table : BaseMigration
{
    public override void Up()
    {
        string sql = ReadScriptFile("20260315000001_SM_DataModel_Add_Table_Up.sql");
        Execute.Sql(sql);
    }

    public override void Down()
    {
        string sql = ReadScriptFile("20260315000001_SM_DataModel_Add_Table_Down.sql");
        Execute.Sql(sql);
    }
}

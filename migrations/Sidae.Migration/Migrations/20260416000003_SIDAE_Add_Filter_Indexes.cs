namespace Sidae.Migration.Migrations;
using FluentMigrator;

[Migration(20260416000003)]
public class SIDAE_Add_Filter_Indexes : BaseMigration
{
    public override void Up()
    {
        string sql = ReadScriptFile("20260416000003_SIDAE_Add_Filter_Indexes_Up.sql");
        Execute.Sql(sql);
    }

    public override void Down()
    {
        string sql = ReadScriptFile("20260416000003_SIDAE_Add_Filter_Indexes_Down.sql");
        Execute.Sql(sql);
    }
}

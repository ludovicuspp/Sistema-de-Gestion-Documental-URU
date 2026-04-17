namespace Sidae.Commons.Entities;

/// <summary>General.AcademicLevel</summary>
public sealed class AcademicLevel
{
    public int Id { get; set; }
    public Guid GuidId { get; set; }
    public string Description { get; set; } = string.Empty;
}

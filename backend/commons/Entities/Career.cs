namespace Sidae.Commons.Entities;

/// <summary>General.Career (catálogo de carreras)</summary>
public sealed class Career
{
    public int Id { get; set; }
    public Guid GuidId { get; set; }
    public string Name { get; set; } = string.Empty;
}

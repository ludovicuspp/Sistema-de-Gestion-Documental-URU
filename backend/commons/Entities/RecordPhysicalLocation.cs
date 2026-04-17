namespace Sidae.Commons.Entities;

/// <summary>Record.PhysicalLocation</summary>
public sealed class RecordPhysicalLocation
{
    public int Id { get; set; }
    public Guid GuidId { get; set; }
    public string Shelf { get; set; } = string.Empty;
    public string Box { get; set; } = string.Empty;
    public string Row { get; set; } = string.Empty;
    public int? Capacity { get; set; }
}

namespace Sidae.Commons.Dtos.RecordPhysicalLocation;

public sealed class CreateRecordPhysicalLocationRequest
{
    public string Shelf { get; set; } = string.Empty;

    public string Box { get; set; } = string.Empty;

    public string Row { get; set; } = string.Empty;

    public int? Capacity { get; set; }
}

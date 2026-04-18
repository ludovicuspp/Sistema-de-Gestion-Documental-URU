namespace Sidae.Commons.Dtos.RecordPhysicalLocation;

public sealed class GetRecordPhysicalLocationRequest
{
    public Guid? GuidId { get; set; }

    public string? Shelf { get; set; }

    public string? Box { get; set; }

    public string? Row { get; set; }

    public int? Capacity { get; set; }
}

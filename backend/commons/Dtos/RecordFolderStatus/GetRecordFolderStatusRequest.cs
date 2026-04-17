namespace Sidae.Commons.Dtos.RecordFolderStatus;

public sealed class GetRecordFolderStatusRequest
{
    public int? Id { get; set; }

    public Guid? GuidId { get; set; }

    public string? Name { get; set; }
}

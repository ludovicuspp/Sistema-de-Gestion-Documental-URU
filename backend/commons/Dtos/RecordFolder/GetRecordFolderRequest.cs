namespace Sidae.Commons.Dtos.RecordFolder;

public sealed class GetRecordFolderRequest
{
    public int? Id { get; set; }

    public Guid? GuidId { get; set; }

    public string? Description { get; set; }

    public int? StudentId { get; set; }

    public int? FolderStatusId { get; set; }

    public int? FolderTypeId { get; set; }

    public int? PhysicalLocationId { get; set; }

    public int? CreatedById { get; set; }
}

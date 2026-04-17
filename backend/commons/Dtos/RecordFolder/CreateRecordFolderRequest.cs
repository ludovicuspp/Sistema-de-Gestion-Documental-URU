namespace Sidae.Commons.Dtos.RecordFolder;

public sealed class CreateRecordFolderRequest
{
    public string? Description { get; set; }

    public int StudentId { get; set; }

    public int FolderStatusId { get; set; }

    public int FolderTypeId { get; set; }

    public int? PhysicalLocationId { get; set; }

    public int? CreatedById { get; set; }
}

namespace Sidae.Commons.Entities;

/// <summary>Record.Observation</summary>
public sealed class RecordObservation
{
    public int Id { get; set; }
    public Guid GuidId { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsResolved { get; set; }
    public int FolderId { get; set; }
    public int? DocumentId { get; set; }
    public int? AuthorId { get; set; }
}

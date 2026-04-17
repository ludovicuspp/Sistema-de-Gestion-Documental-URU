namespace Sidae.Commons.Dtos.RecordObservation;

public sealed class GetRecordObservationRequest
{
    public int? Id { get; set; }

    public Guid? GuidId { get; set; }

    public string? Comment { get; set; }

    public bool? IsResolved { get; set; }

    public int? FolderId { get; set; }

    public int? DocumentId { get; set; }

    public int? AuthorId { get; set; }
}

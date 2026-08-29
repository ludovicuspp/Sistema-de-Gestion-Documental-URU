namespace Sidae.Commons.Dtos.RecordObservation;

public sealed class UpdateRecordObservationRequest
{
    public string? Comment { get; set; }

    public bool IsResolved { get; set; }

    public int? DocumentId { get; set; }

    public int? AuthorId { get; set; }
}

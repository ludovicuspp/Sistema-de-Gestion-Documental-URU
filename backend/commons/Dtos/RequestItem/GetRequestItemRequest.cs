namespace Sidae.Commons.Dtos.RequestItem;

public sealed class GetRequestItemRequest
{
    public Guid? GuidId { get; set; }

    public string? EmailContact { get; set; }

    public string? TrackingCode { get; set; }

    public int? StudentId { get; set; }

    public int? StatusRequestId { get; set; }
}

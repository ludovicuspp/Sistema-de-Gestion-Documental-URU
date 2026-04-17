namespace Sidae.Commons.Dtos.RequestItem;

public sealed class UpdateRequestItemRequest
{
    public string EmailContact { get; set; } = string.Empty;

    public string? TrackingCode { get; set; }

    public int? StudentId { get; set; }

    public int StatusRequestId { get; set; }
}

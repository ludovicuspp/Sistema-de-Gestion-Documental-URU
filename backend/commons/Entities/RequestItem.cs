namespace Sidae.Commons.Entities;

/// <summary>Request.Request</summary>
public sealed class RequestItem
{
    public int Id { get; set; }
    public Guid GuidId { get; set; }
    public string EmailContact { get; set; } = string.Empty;
    public string? TrackingCode { get; set; }
    public DateTime RequestAt { get; set; }
    public int? StudentId { get; set; }
    public int StatusRequestId { get; set; }
}

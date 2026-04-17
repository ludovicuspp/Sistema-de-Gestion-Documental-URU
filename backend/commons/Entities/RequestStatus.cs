namespace Sidae.Commons.Entities;

/// <summary>Request.Status</summary>
public sealed class RequestStatus
{
    public int Id { get; set; }
    public Guid GuidId { get; set; }
    public string Description { get; set; } = string.Empty;
}

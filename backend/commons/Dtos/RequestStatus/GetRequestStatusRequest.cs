namespace Sidae.Commons.Dtos.RequestStatus;

public sealed class GetRequestStatusRequest
{
    public Guid? GuidId { get; set; }

    public string? Name { get; set; }
}

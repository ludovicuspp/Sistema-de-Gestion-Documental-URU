namespace Sidae.Commons.Dtos.RequestStatus;

public sealed class RequestStatusResponse
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Description { get; set; } = string.Empty;
}

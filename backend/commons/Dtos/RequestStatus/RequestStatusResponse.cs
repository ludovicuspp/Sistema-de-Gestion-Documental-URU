namespace Sidae.Commons.Dtos.RequestStatus;

public sealed class RequestStatusResponse
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Name { get; set; } = string.Empty;
}

namespace Sidae.Commons.Dtos.SecurityAction;

public sealed class GetSecurityActionRequest
{
    public Guid? GuidId { get; set; }

    public string? Name { get; set; }
}

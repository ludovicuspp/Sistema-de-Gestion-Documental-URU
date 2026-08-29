namespace Sidae.Commons.Dtos.SecurityAction;

public sealed class SecurityActionResponse
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Name { get; set; } = string.Empty;
}

namespace Sidae.Commons.Dtos.MimeType;

public sealed class MimeTypeResponse
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Name { get; set; } = string.Empty;
}

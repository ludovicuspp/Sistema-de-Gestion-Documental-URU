namespace Sidae.Commons.Dtos.DocumentType;

public sealed class DocumentTypeResponse
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}

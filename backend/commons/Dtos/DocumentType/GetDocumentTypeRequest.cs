namespace Sidae.Commons.Dtos.DocumentType;

public sealed class GetDocumentTypeRequest
{
    public int? Id { get; set; }

    public Guid? GuidId { get; set; }

    public string? Nombre { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}

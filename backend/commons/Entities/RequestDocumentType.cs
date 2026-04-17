namespace Sidae.Commons.Entities;

/// <summary>Request.DocumentType (relación solicitud ↔ tipo de documento)</summary>
public sealed class RequestDocumentType
{
    public int Id { get; set; }
    public Guid GuidId { get; set; }
    public int RequestId { get; set; }
    public int DocumentTypeId { get; set; }
}

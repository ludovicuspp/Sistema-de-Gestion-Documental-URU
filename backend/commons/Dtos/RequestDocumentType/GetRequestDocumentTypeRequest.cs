namespace Sidae.Commons.Dtos.RequestDocumentType;

public sealed class GetRequestDocumentTypeRequest
{
    public Guid? GuidId { get; set; }

    public int? RequestId { get; set; }

    public int? DocumentTypeId { get; set; }
}

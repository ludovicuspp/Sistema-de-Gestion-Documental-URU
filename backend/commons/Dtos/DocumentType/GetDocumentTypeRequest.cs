namespace Sidae.Commons.Dtos.DocumentType;

public sealed class GetDocumentTypeRequest
{
    public Guid? GuidId { get; set; }

    public string? Name { get; set; }

    public bool? IsMandatory { get; set; }

    public string? RequiredLevel { get; set; }
}

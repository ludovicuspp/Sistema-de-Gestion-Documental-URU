namespace Sidae.Commons.Dtos.DocumentType;

public sealed class UpdateDocumentTypeRequest
{
    public string Name { get; set; } = string.Empty;

    public bool IsRequired { get; set; }
}

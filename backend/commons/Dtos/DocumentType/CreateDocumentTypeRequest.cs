namespace Sidae.Commons.Dtos.DocumentType;

public sealed class CreateDocumentTypeRequest
{
    public string Name { get; set; } = string.Empty;

    public bool IsMandatory { get; set; }

    public string? RequiredLevel { get; set; }
}

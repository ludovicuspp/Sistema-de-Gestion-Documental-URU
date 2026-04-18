namespace Sidae.Commons.Dtos.DocumentType;

public sealed class DocumentTypeResponse
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Name { get; set; } = string.Empty;

    public bool IsMandatory { get; set; }

    public List<string> AcademicLevels { get; set; } = new();
}

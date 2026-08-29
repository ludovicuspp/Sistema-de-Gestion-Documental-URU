namespace Sidae.Commons.Entities;

/// <summary>
/// Tipo de documento (catalogo).
/// </summary>
public sealed class DocumentType
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Name { get; set; } = string.Empty;

    public bool IsRequired { get; set; }

    public ICollection<DocumentTypeAcademicLevel> TypeAcademicLevels { get; set; } = new List<DocumentTypeAcademicLevel>();
}

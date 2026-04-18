namespace Sidae.Commons.Entities;

/// <summary>Document.TypeAcademicLevel — asociación tipo de documento ↔ nivel académico.</summary>
public sealed class DocumentTypeAcademicLevel
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public int DocumentTypeId { get; set; }

    public int AcademicLevelId { get; set; }

    public DocumentType DocumentType { get; set; } = null!;

    public AcademicLevel AcademicLevel { get; set; } = null!;
}

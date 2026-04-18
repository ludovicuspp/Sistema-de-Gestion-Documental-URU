namespace Sidae.Commons.Dtos.DocumentType;

public sealed class GetDocumentTypeRequest
{
    public Guid? GuidId { get; set; }

    public string? Name { get; set; }

    public bool? IsRequired { get; set; }

    /// <summary>Filtra tipos asociados a este nivel académico (General.AcademicLevel.Id).</summary>
    public int? AcademicLevelId { get; set; }
}

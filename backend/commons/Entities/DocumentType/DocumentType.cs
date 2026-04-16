namespace Sidae.Commons.Entities;

/// <summary>
/// Tipo de documento (catalogo).
/// </summary>
public sealed class DocumentType
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}

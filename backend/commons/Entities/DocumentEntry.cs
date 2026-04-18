namespace Sidae.Commons.Entities;

/// <summary>Document.Document — archivo asociado a un expediente (carpeta).</summary>
public sealed class DocumentEntry
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Url { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public long? Size { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool Active { get; set; }

    public int FolderId { get; set; }

    public int? MimeTypeId { get; set; }

    public int? DocumentTypeId { get; set; }

    public int? CreatedById { get; set; }

    public int? UpdatedById { get; set; }
}

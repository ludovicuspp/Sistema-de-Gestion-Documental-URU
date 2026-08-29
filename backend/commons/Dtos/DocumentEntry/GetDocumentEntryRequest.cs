namespace Sidae.Commons.Dtos.DocumentEntry;

public sealed class GetDocumentEntryRequest
{
    public Guid? GuidId { get; set; }

    public string? Name { get; set; }

    public int? FolderId { get; set; }

    public bool? Active { get; set; }

    public int? MimeTypeId { get; set; }

    public int? DocumentTypeId { get; set; }
}

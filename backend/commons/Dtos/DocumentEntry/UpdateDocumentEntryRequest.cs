namespace Sidae.Commons.Dtos.DocumentEntry;

public sealed class UpdateDocumentEntryRequest
{
    public string Url { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public long? Size { get; set; }

    public bool Active { get; set; }

    public int? MimeTypeId { get; set; }

    public int? DocumentTypeId { get; set; }

    public int? UpdatedById { get; set; }
}

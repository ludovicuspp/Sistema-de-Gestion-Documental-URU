namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.DocumentEntry;
using Sidae.Commons.Patterns;

public interface IDocumentEntryService
{
    Task<Result<List<DocumentEntryResponse>>> GetAllAsync(GetDocumentEntryRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<DocumentEntryResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default);

    Task<Result<DocumentEntryResponse>> CreateAsync(CreateDocumentEntryRequest request, CancellationToken cancellationToken = default);

    Task<Result<DocumentEntryResponse>> UpdateAsync(Guid guidId, UpdateDocumentEntryRequest request, CancellationToken cancellationToken = default);
}

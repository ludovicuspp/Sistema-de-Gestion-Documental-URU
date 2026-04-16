namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.DocumentType;
using Sidae.Commons.Patterns;

public interface IDocumentTypeService
{
    Task<Result<List<DocumentTypeResponse>>> GetAllAsync(GetDocumentTypeRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<DocumentTypeResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<DocumentTypeResponse>> CreateAsync(CreateDocumentTypeRequest request, CancellationToken cancellationToken = default);

    Task<Result<DocumentTypeResponse>> UpdateAsync(int id, UpdateDocumentTypeRequest request, CancellationToken cancellationToken = default);
}

namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.RequestDocumentType;
using Sidae.Commons.Patterns;

public interface IRequestDocumentTypeService
{
    Task<Result<List<RequestDocumentTypeResponse>>> GetAllAsync(GetRequestDocumentTypeRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<RequestDocumentTypeResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<RequestDocumentTypeResponse>> CreateAsync(CreateRequestDocumentTypeRequest request, CancellationToken cancellationToken = default);

    Task<Result<RequestDocumentTypeResponse>> UpdateAsync(int id, UpdateRequestDocumentTypeRequest request, CancellationToken cancellationToken = default);
}

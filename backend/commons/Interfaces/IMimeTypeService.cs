namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.MimeType;
using Sidae.Commons.Patterns;

public interface IMimeTypeService
{
    Task<Result<List<MimeTypeResponse>>> GetAllAsync(GetMimeTypeRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<MimeTypeResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default);

    Task<Result<MimeTypeResponse>> CreateAsync(CreateMimeTypeRequest request, CancellationToken cancellationToken = default);

    Task<Result<MimeTypeResponse>> UpdateAsync(Guid guidId, UpdateMimeTypeRequest request, CancellationToken cancellationToken = default);
}

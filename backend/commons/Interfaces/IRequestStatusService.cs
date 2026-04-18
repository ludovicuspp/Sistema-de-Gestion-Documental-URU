namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.RequestStatus;
using Sidae.Commons.Patterns;

public interface IRequestStatusService
{
    Task<Result<List<RequestStatusResponse>>> GetAllAsync(GetRequestStatusRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<RequestStatusResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default);

    Task<Result<RequestStatusResponse>> CreateAsync(CreateRequestStatusRequest request, CancellationToken cancellationToken = default);

    Task<Result<RequestStatusResponse>> UpdateAsync(Guid guidId, UpdateRequestStatusRequest request, CancellationToken cancellationToken = default);
}

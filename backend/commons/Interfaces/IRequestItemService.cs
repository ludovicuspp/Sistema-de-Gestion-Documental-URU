namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.RequestItem;
using Sidae.Commons.Patterns;

public interface IRequestItemService
{
    Task<Result<List<RequestItemResponse>>> GetAllAsync(GetRequestItemRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<RequestItemResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<RequestItemResponse>> CreateAsync(CreateRequestItemRequest request, CancellationToken cancellationToken = default);

    Task<Result<RequestItemResponse>> UpdateAsync(int id, UpdateRequestItemRequest request, CancellationToken cancellationToken = default);
}

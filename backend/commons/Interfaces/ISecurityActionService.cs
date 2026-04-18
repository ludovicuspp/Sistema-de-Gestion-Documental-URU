namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.SecurityAction;
using Sidae.Commons.Patterns;

public interface ISecurityActionService
{
    Task<Result<List<SecurityActionResponse>>> GetAllAsync(GetSecurityActionRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<SecurityActionResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default);

    Task<Result<SecurityActionResponse>> CreateAsync(CreateSecurityActionRequest request, CancellationToken cancellationToken = default);

    Task<Result<SecurityActionResponse>> UpdateAsync(Guid guidId, UpdateSecurityActionRequest request, CancellationToken cancellationToken = default);
}

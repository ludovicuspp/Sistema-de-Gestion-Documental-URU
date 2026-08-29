namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.SecurityRole;
using Sidae.Commons.Patterns;

public interface ISecurityRoleService
{
    Task<Result<List<SecurityRoleResponse>>> GetAllAsync(GetSecurityRoleRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<SecurityRoleResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default);

    Task<Result<SecurityRoleResponse>> CreateAsync(CreateSecurityRoleRequest request, CancellationToken cancellationToken = default);

    Task<Result<SecurityRoleResponse>> UpdateAsync(Guid guidId, UpdateSecurityRoleRequest request, CancellationToken cancellationToken = default);
}

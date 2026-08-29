namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.Career;
using Sidae.Commons.Patterns;

public interface ICareerService
{
    Task<Result<List<CareerResponse>>> GetAllAsync(GetCareerRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<CareerResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default);

    Task<Result<CareerResponse>> CreateAsync(CreateCareerRequest request, CancellationToken cancellationToken = default);

    Task<Result<CareerResponse>> UpdateAsync(Guid guidId, UpdateCareerRequest request, CancellationToken cancellationToken = default);
}

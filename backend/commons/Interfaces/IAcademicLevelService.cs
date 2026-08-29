namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.AcademicLevel;
using Sidae.Commons.Patterns;

public interface IAcademicLevelService
{
    Task<Result<List<AcademicLevelResponse>>> GetAllAsync(GetAcademicLevelRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<AcademicLevelResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default);

    Task<Result<AcademicLevelResponse>> CreateAsync(CreateAcademicLevelRequest request, CancellationToken cancellationToken = default);

    Task<Result<AcademicLevelResponse>> UpdateAsync(Guid guidId, UpdateAcademicLevelRequest request, CancellationToken cancellationToken = default);
}

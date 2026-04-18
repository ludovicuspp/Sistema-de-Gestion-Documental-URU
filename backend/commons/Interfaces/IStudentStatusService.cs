namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.StudentStatus;
using Sidae.Commons.Patterns;

public interface IStudentStatusService
{
    Task<Result<List<StudentStatusResponse>>> GetAllAsync(GetStudentStatusRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<StudentStatusResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default);

    Task<Result<StudentStatusResponse>> CreateAsync(CreateStudentStatusRequest request, CancellationToken cancellationToken = default);

    Task<Result<StudentStatusResponse>> UpdateAsync(Guid guidId, UpdateStudentStatusRequest request, CancellationToken cancellationToken = default);
}

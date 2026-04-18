namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.TaskStatus;
using Sidae.Commons.Patterns;

public interface ITaskStatusService
{
    Task<Result<List<TaskStatusResponse>>> GetAllAsync(GetTaskStatusRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<TaskStatusResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default);

    Task<Result<TaskStatusResponse>> CreateAsync(CreateTaskStatusRequest request, CancellationToken cancellationToken = default);

    Task<Result<TaskStatusResponse>> UpdateAsync(Guid guidId, UpdateTaskStatusRequest request, CancellationToken cancellationToken = default);
}

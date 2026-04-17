namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.RecordFolderStatus;
using Sidae.Commons.Patterns;

public interface IRecordFolderStatusService
{
    Task<Result<List<RecordFolderStatusResponse>>> GetAllAsync(GetRecordFolderStatusRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<RecordFolderStatusResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<RecordFolderStatusResponse>> CreateAsync(CreateRecordFolderStatusRequest request, CancellationToken cancellationToken = default);

    Task<Result<RecordFolderStatusResponse>> UpdateAsync(int id, UpdateRecordFolderStatusRequest request, CancellationToken cancellationToken = default);
}

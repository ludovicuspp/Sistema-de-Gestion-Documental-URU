namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.RecordFolderType;
using Sidae.Commons.Patterns;

public interface IRecordFolderTypeService
{
    Task<Result<List<RecordFolderTypeResponse>>> GetAllAsync(GetRecordFolderTypeRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<RecordFolderTypeResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default);

    Task<Result<RecordFolderTypeResponse>> CreateAsync(CreateRecordFolderTypeRequest request, CancellationToken cancellationToken = default);

    Task<Result<RecordFolderTypeResponse>> UpdateAsync(Guid guidId, UpdateRecordFolderTypeRequest request, CancellationToken cancellationToken = default);
}

namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.RecordFolderType;
using Sidae.Commons.Patterns;

public interface IRecordFolderTypeService
{
    Task<Result<List<RecordFolderTypeResponse>>> GetAllAsync(GetRecordFolderTypeRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<RecordFolderTypeResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<RecordFolderTypeResponse>> CreateAsync(CreateRecordFolderTypeRequest request, CancellationToken cancellationToken = default);

    Task<Result<RecordFolderTypeResponse>> UpdateAsync(int id, UpdateRecordFolderTypeRequest request, CancellationToken cancellationToken = default);
}

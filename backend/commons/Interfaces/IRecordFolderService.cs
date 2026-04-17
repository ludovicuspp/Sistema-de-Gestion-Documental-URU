namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.RecordFolder;
using Sidae.Commons.Patterns;

public interface IRecordFolderService
{
    Task<Result<List<RecordFolderResponse>>> GetAllAsync(GetRecordFolderRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<RecordFolderResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<RecordFolderResponse>> CreateAsync(CreateRecordFolderRequest request, CancellationToken cancellationToken = default);

    Task<Result<RecordFolderResponse>> UpdateAsync(int id, UpdateRecordFolderRequest request, CancellationToken cancellationToken = default);
}

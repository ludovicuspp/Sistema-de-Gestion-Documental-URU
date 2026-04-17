namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.RecordPhysicalLocation;
using Sidae.Commons.Patterns;

public interface IRecordPhysicalLocationService
{
    Task<Result<List<RecordPhysicalLocationResponse>>> GetAllAsync(GetRecordPhysicalLocationRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<RecordPhysicalLocationResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<RecordPhysicalLocationResponse>> CreateAsync(CreateRecordPhysicalLocationRequest request, CancellationToken cancellationToken = default);

    Task<Result<RecordPhysicalLocationResponse>> UpdateAsync(int id, UpdateRecordPhysicalLocationRequest request, CancellationToken cancellationToken = default);
}

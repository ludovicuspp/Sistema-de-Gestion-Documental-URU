namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.RecordPhysicalLocation;
using Sidae.Commons.Patterns;

public interface IRecordPhysicalLocationService
{
    Task<Result<List<RecordPhysicalLocationResponse>>> GetAllAsync(GetRecordPhysicalLocationRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<RecordPhysicalLocationResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default);

    Task<Result<RecordPhysicalLocationResponse>> CreateAsync(CreateRecordPhysicalLocationRequest request, CancellationToken cancellationToken = default);

    Task<Result<RecordPhysicalLocationResponse>> UpdateAsync(Guid guidId, UpdateRecordPhysicalLocationRequest request, CancellationToken cancellationToken = default);
}

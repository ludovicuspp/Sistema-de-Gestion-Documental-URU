namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Dtos.RecordObservation;
using Sidae.Commons.Patterns;

public interface IRecordObservationService
{
    Task<Result<List<RecordObservationResponse>>> GetAllAsync(GetRecordObservationRequest? request = null, CancellationToken cancellationToken = default);

    Task<Result<RecordObservationResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default);

    Task<Result<RecordObservationResponse>> CreateAsync(CreateRecordObservationRequest request, CancellationToken cancellationToken = default);

    Task<Result<RecordObservationResponse>> UpdateAsync(Guid guidId, UpdateRecordObservationRequest request, CancellationToken cancellationToken = default);
}

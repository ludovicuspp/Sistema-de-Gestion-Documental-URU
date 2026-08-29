namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.RequestStatus;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class RequestStatusService : IRequestStatusService
{
    private readonly AppDbContext _db;

    public RequestStatusService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<RequestStatusResponse>>> GetAllAsync(GetRequestStatusRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<RequestStatus> query = _db.RequestStatuses.AsNoTracking();

        if (request is not null)
        {
            if (request.GuidId.HasValue)
                query = query.Where(e => e.GuidId == request.GuidId.Value);

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                var d = request.Name.Trim();
                query = query.Where(e => e.Name.Contains(d));
            }
        }

        var list = await query
            .OrderBy(e => e.Name)
            .Select(e => new RequestStatusResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Name = e.Name,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<RequestStatusResponse>>.Success(list);
    }

    public async Task<Result<RequestStatusResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.RequestStatuses
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RequestStatusResponse>.Failure(new Error("NOT_FOUND", "Request.Status no encontrado."));

        return Result<RequestStatusResponse>.Success(Map(entity));
    }

    public async Task<Result<RequestStatusResponse>> CreateAsync(CreateRequestStatusRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<RequestStatusResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = new RequestStatus
        {
            GuidId = Guid.NewGuid(),
            Name = request.Name.Trim(),
        };

        _db.RequestStatuses.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RequestStatusResponse>.Success(Map(entity));
    }

    public async Task<Result<RequestStatusResponse>> UpdateAsync(Guid guidId, UpdateRequestStatusRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<RequestStatusResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = await _db.RequestStatuses
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RequestStatusResponse>.Failure(new Error("NOT_FOUND", "Request.Status no encontrado."));

        entity.Name = request.Name.Trim();
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RequestStatusResponse>.Success(Map(entity));
    }

    private static RequestStatusResponse Map(RequestStatus e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Name = e.Name,
    };
}

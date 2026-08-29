namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.RequestItem;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class RequestItemService : IRequestItemService
{
    private readonly AppDbContext _db;

    public RequestItemService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<RequestItemResponse>>> GetAllAsync(GetRequestItemRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<RequestItem> query = _db.RequestItems.AsNoTracking();

        if (request is not null)
        {
            if (request.GuidId.HasValue)
                query = query.Where(e => e.GuidId == request.GuidId.Value);

            if (!string.IsNullOrWhiteSpace(request.EmailContact))
            {
                var v = request.EmailContact.Trim();
                query = query.Where(e => e.EmailContact.Contains(v));
            }

            if (!string.IsNullOrWhiteSpace(request.TrackingCode))
            {
                var v = request.TrackingCode.Trim();
                query = query.Where(e => e.TrackingCode != null && e.TrackingCode.Contains(v));
            }

            if (request.StudentId.HasValue)
                query = query.Where(e => e.StudentId == request.StudentId.Value);

            if (request.StatusRequestId.HasValue)
                query = query.Where(e => e.StatusRequestId == request.StatusRequestId.Value);
        }

        var list = await query
            .OrderByDescending(e => e.RequestAt)
            .Select(e => new RequestItemResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                EmailContact = e.EmailContact,
                TrackingCode = e.TrackingCode,
                RequestAt = e.RequestAt,
                StudentId = e.StudentId,
                StatusRequestId = e.StatusRequestId,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<RequestItemResponse>>.Success(list);
    }

    public async Task<Result<RequestItemResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.RequestItems
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RequestItemResponse>.Failure(new Error("NOT_FOUND", "Request no encontrado."));

        return Result<RequestItemResponse>.Success(Map(entity));
    }

    public async Task<Result<RequestItemResponse>> CreateAsync(CreateRequestItemRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.EmailContact))
            return Result<RequestItemResponse>.Failure(new Error("VALIDATION", "EmailContact es obligatorio."));

        var entity = new RequestItem
        {
            GuidId = Guid.NewGuid(),
            EmailContact = request.EmailContact.Trim(),
            TrackingCode = string.IsNullOrWhiteSpace(request.TrackingCode) ? null : request.TrackingCode.Trim(),
            RequestAt = DateTime.UtcNow,
            StudentId = request.StudentId,
            StatusRequestId = request.StatusRequestId,
        };

        _db.RequestItems.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RequestItemResponse>.Success(Map(entity));
    }

    public async Task<Result<RequestItemResponse>> UpdateAsync(Guid guidId, UpdateRequestItemRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.EmailContact))
            return Result<RequestItemResponse>.Failure(new Error("VALIDATION", "EmailContact es obligatorio."));

        var entity = await _db.RequestItems
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RequestItemResponse>.Failure(new Error("NOT_FOUND", "Request no encontrado."));

        entity.EmailContact = request.EmailContact.Trim();
        entity.TrackingCode = string.IsNullOrWhiteSpace(request.TrackingCode) ? null : request.TrackingCode.Trim();
        entity.StudentId = request.StudentId;
        entity.StatusRequestId = request.StatusRequestId;
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RequestItemResponse>.Success(Map(entity));
    }

    private static RequestItemResponse Map(RequestItem e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        EmailContact = e.EmailContact,
        TrackingCode = e.TrackingCode,
        RequestAt = e.RequestAt,
        StudentId = e.StudentId,
        StatusRequestId = e.StatusRequestId,
    };
}

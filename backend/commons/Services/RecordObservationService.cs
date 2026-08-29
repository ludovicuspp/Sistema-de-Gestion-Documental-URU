namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.RecordObservation;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class RecordObservationService : IRecordObservationService
{
    private readonly AppDbContext _db;

    public RecordObservationService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<RecordObservationResponse>>> GetAllAsync(GetRecordObservationRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<RecordObservation> query = _db.RecordObservations.AsNoTracking();

        if (request is not null)
        {
            if (request.GuidId.HasValue)
                query = query.Where(e => e.GuidId == request.GuidId.Value);

            if (!string.IsNullOrWhiteSpace(request.Comment))
            {
                var c = request.Comment.Trim();
                query = query.Where(e => e.Comment != null && e.Comment.Contains(c));
            }

            if (request.IsResolved.HasValue)
                query = query.Where(e => e.IsResolved == request.IsResolved.Value);

            if (request.FolderId.HasValue)
                query = query.Where(e => e.FolderId == request.FolderId.Value);

            if (request.DocumentId.HasValue)
                query = query.Where(e => e.DocumentId == request.DocumentId.Value);

            if (request.AuthorId.HasValue)
                query = query.Where(e => e.AuthorId == request.AuthorId.Value);
        }

        var list = await query
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new RecordObservationResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Comment = e.Comment,
                CreatedAt = e.CreatedAt,
                IsResolved = e.IsResolved,
                FolderId = e.FolderId,
                DocumentId = e.DocumentId,
                AuthorId = e.AuthorId,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<RecordObservationResponse>>.Success(list);
    }

    public async Task<Result<RecordObservationResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.RecordObservations
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RecordObservationResponse>.Failure(new Error("NOT_FOUND", "Observation no encontrado."));

        return Result<RecordObservationResponse>.Success(Map(entity));
    }

    public async Task<Result<RecordObservationResponse>> CreateAsync(CreateRecordObservationRequest request, CancellationToken cancellationToken = default)
    {
        var entity = new RecordObservation
        {
            GuidId = Guid.NewGuid(),
            Comment = string.IsNullOrWhiteSpace(request.Comment) ? null : request.Comment.Trim(),
            CreatedAt = DateTime.UtcNow,
            IsResolved = request.IsResolved,
            FolderId = request.FolderId,
            DocumentId = request.DocumentId,
            AuthorId = request.AuthorId,
        };

        _db.RecordObservations.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RecordObservationResponse>.Success(Map(entity));
    }

    public async Task<Result<RecordObservationResponse>> UpdateAsync(Guid guidId, UpdateRecordObservationRequest request, CancellationToken cancellationToken = default)
    {
        var entity = await _db.RecordObservations
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RecordObservationResponse>.Failure(new Error("NOT_FOUND", "Observation no encontrado."));

        entity.Comment = string.IsNullOrWhiteSpace(request.Comment) ? null : request.Comment.Trim();
        entity.IsResolved = request.IsResolved;
        entity.DocumentId = request.DocumentId;
        entity.AuthorId = request.AuthorId;
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RecordObservationResponse>.Success(Map(entity));
    }

    private static RecordObservationResponse Map(RecordObservation e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Comment = e.Comment,
        CreatedAt = e.CreatedAt,
        IsResolved = e.IsResolved,
        FolderId = e.FolderId,
        DocumentId = e.DocumentId,
        AuthorId = e.AuthorId,
    };
}

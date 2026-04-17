namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.RecordFolderStatus;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class RecordFolderStatusService : IRecordFolderStatusService
{
    private readonly AppDbContext _db;

    public RecordFolderStatusService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<RecordFolderStatusResponse>>> GetAllAsync(GetRecordFolderStatusRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<RecordFolderStatus> query = _db.RecordFolderStatuses.AsNoTracking();

        if (request is not null)
        {
            if (request.Id.HasValue)
                query = query.Where(e => e.Id == request.Id.Value);

            if (request.GuidId.HasValue)
                query = query.Where(e => e.GuidId == request.GuidId.Value);

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                var name = request.Name.Trim();
                query = query.Where(e => e.Name.Contains(name));
            }
        }

        var list = await query
            .OrderBy(e => e.Name)
            .Select(e => new RecordFolderStatusResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Name = e.Name,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<RecordFolderStatusResponse>>.Success(list);
    }

    public async Task<Result<RecordFolderStatusResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.RecordFolderStatuses
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RecordFolderStatusResponse>.Failure(new Error("NOT_FOUND", "FolderStatus no encontrado."));

        return Result<RecordFolderStatusResponse>.Success(Map(entity));
    }

    public async Task<Result<RecordFolderStatusResponse>> CreateAsync(CreateRecordFolderStatusRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<RecordFolderStatusResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = new RecordFolderStatus
        {
            GuidId = Guid.NewGuid(),
            Name = request.Name.Trim(),
        };

        _db.RecordFolderStatuses.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RecordFolderStatusResponse>.Success(Map(entity));
    }

    public async Task<Result<RecordFolderStatusResponse>> UpdateAsync(int id, UpdateRecordFolderStatusRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<RecordFolderStatusResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = await _db.RecordFolderStatuses
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RecordFolderStatusResponse>.Failure(new Error("NOT_FOUND", "FolderStatus no encontrado."));

        entity.Name = request.Name.Trim();
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RecordFolderStatusResponse>.Success(Map(entity));
    }

    private static RecordFolderStatusResponse Map(RecordFolderStatus e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Name = e.Name,
    };
}

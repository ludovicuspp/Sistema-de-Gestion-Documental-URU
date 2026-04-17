namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.RecordFolder;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class RecordFolderService : IRecordFolderService
{
    private readonly AppDbContext _db;

    public RecordFolderService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<RecordFolderResponse>>> GetAllAsync(GetRecordFolderRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<RecordFolder> query = _db.RecordFolders.AsNoTracking();

        if (request is not null)
        {
            if (request.Id.HasValue)
                query = query.Where(e => e.Id == request.Id.Value);

            if (request.GuidId.HasValue)
                query = query.Where(e => e.GuidId == request.GuidId.Value);

            if (!string.IsNullOrWhiteSpace(request.Description))
            {
                var d = request.Description.Trim();
                query = query.Where(e => e.Description != null && e.Description.Contains(d));
            }

            if (request.StudentId.HasValue)
                query = query.Where(e => e.StudentId == request.StudentId.Value);

            if (request.FolderStatusId.HasValue)
                query = query.Where(e => e.FolderStatusId == request.FolderStatusId.Value);

            if (request.FolderTypeId.HasValue)
                query = query.Where(e => e.FolderTypeId == request.FolderTypeId.Value);

            if (request.PhysicalLocationId.HasValue)
                query = query.Where(e => e.PhysicalLocationId == request.PhysicalLocationId.Value);

            if (request.CreatedById.HasValue)
                query = query.Where(e => e.CreatedById == request.CreatedById.Value);
        }

        var list = await query
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new RecordFolderResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Description = e.Description,
                CreatedAt = e.CreatedAt,
                StudentId = e.StudentId,
                FolderStatusId = e.FolderStatusId,
                FolderTypeId = e.FolderTypeId,
                PhysicalLocationId = e.PhysicalLocationId,
                CreatedById = e.CreatedById,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<RecordFolderResponse>>.Success(list);
    }

    public async Task<Result<RecordFolderResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.RecordFolders
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RecordFolderResponse>.Failure(new Error("NOT_FOUND", "Folder no encontrado."));

        return Result<RecordFolderResponse>.Success(Map(entity));
    }

    public async Task<Result<RecordFolderResponse>> CreateAsync(CreateRecordFolderRequest request, CancellationToken cancellationToken = default)
    {
        var entity = new RecordFolder
        {
            GuidId = Guid.NewGuid(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            CreatedAt = DateTime.UtcNow,
            StudentId = request.StudentId,
            FolderStatusId = request.FolderStatusId,
            FolderTypeId = request.FolderTypeId,
            PhysicalLocationId = request.PhysicalLocationId,
            CreatedById = request.CreatedById,
        };

        _db.RecordFolders.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RecordFolderResponse>.Success(Map(entity));
    }

    public async Task<Result<RecordFolderResponse>> UpdateAsync(int id, UpdateRecordFolderRequest request, CancellationToken cancellationToken = default)
    {
        var entity = await _db.RecordFolders
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RecordFolderResponse>.Failure(new Error("NOT_FOUND", "Folder no encontrado."));

        entity.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        entity.StudentId = request.StudentId;
        entity.FolderStatusId = request.FolderStatusId;
        entity.FolderTypeId = request.FolderTypeId;
        entity.PhysicalLocationId = request.PhysicalLocationId;
        entity.CreatedById = request.CreatedById;
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RecordFolderResponse>.Success(Map(entity));
    }

    private static RecordFolderResponse Map(RecordFolder e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Description = e.Description,
        CreatedAt = e.CreatedAt,
        StudentId = e.StudentId,
        FolderStatusId = e.FolderStatusId,
        FolderTypeId = e.FolderTypeId,
        PhysicalLocationId = e.PhysicalLocationId,
        CreatedById = e.CreatedById,
    };
}

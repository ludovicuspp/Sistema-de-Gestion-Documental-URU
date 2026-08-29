namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.RecordFolderType;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class RecordFolderTypeService : IRecordFolderTypeService
{
    private readonly AppDbContext _db;

    public RecordFolderTypeService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<RecordFolderTypeResponse>>> GetAllAsync(GetRecordFolderTypeRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<RecordFolderType> query = _db.RecordFolderTypes.AsNoTracking();

        if (request is not null)
        {
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
            .Select(e => new RecordFolderTypeResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Name = e.Name,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<RecordFolderTypeResponse>>.Success(list);
    }

    public async Task<Result<RecordFolderTypeResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.RecordFolderTypes
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RecordFolderTypeResponse>.Failure(new Error("NOT_FOUND", "FolderType no encontrado."));

        return Result<RecordFolderTypeResponse>.Success(Map(entity));
    }

    public async Task<Result<RecordFolderTypeResponse>> CreateAsync(CreateRecordFolderTypeRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<RecordFolderTypeResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = new RecordFolderType
        {
            GuidId = Guid.NewGuid(),
            Name = request.Name.Trim(),
        };

        _db.RecordFolderTypes.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RecordFolderTypeResponse>.Success(Map(entity));
    }

    public async Task<Result<RecordFolderTypeResponse>> UpdateAsync(Guid guidId, UpdateRecordFolderTypeRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<RecordFolderTypeResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = await _db.RecordFolderTypes
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RecordFolderTypeResponse>.Failure(new Error("NOT_FOUND", "FolderType no encontrado."));

        entity.Name = request.Name.Trim();
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RecordFolderTypeResponse>.Success(Map(entity));
    }

    private static RecordFolderTypeResponse Map(RecordFolderType e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Name = e.Name,
    };
}

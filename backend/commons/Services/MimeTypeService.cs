namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.MimeType;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class MimeTypeService : IMimeTypeService
{
    private readonly AppDbContext _db;

    public MimeTypeService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<MimeTypeResponse>>> GetAllAsync(GetMimeTypeRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MimeType> query = _db.MimeTypes.AsNoTracking();

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
            .Select(e => new MimeTypeResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Name = e.Name,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<MimeTypeResponse>>.Success(list);
    }

    public async Task<Result<MimeTypeResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.MimeTypes
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<MimeTypeResponse>.Failure(new Error("NOT_FOUND", "MimeType no encontrado."));

        return Result<MimeTypeResponse>.Success(Map(entity));
    }

    public async Task<Result<MimeTypeResponse>> CreateAsync(CreateMimeTypeRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<MimeTypeResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = new MimeType
        {
            GuidId = Guid.NewGuid(),
            Name = request.Name.Trim(),
        };

        _db.MimeTypes.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<MimeTypeResponse>.Success(Map(entity));
    }

    public async Task<Result<MimeTypeResponse>> UpdateAsync(Guid guidId, UpdateMimeTypeRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<MimeTypeResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = await _db.MimeTypes
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<MimeTypeResponse>.Failure(new Error("NOT_FOUND", "MimeType no encontrado."));

        entity.Name = request.Name.Trim();
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<MimeTypeResponse>.Success(Map(entity));
    }

    private static MimeTypeResponse Map(MimeType e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Name = e.Name,
    };
}

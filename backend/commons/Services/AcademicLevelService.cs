namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.AcademicLevel;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class AcademicLevelService : IAcademicLevelService
{
    private readonly AppDbContext _db;

    public AcademicLevelService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<AcademicLevelResponse>>> GetAllAsync(GetAcademicLevelRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<AcademicLevel> query = _db.AcademicLevels.AsNoTracking();

        if (request is not null)
        {
            if (request.Id.HasValue)
                query = query.Where(e => e.Id == request.Id.Value);

            if (request.GuidId.HasValue)
                query = query.Where(e => e.GuidId == request.GuidId.Value);

            if (!string.IsNullOrWhiteSpace(request.Description))
            {
                var d = request.Description.Trim();
                query = query.Where(e => e.Description.Contains(d));
            }
        }

        var list = await query
            .OrderBy(e => e.Description)
            .Select(e => new AcademicLevelResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Description = e.Description,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<AcademicLevelResponse>>.Success(list);
    }

    public async Task<Result<AcademicLevelResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.AcademicLevels
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<AcademicLevelResponse>.Failure(new Error("NOT_FOUND", "AcademicLevel no encontrado."));

        return Result<AcademicLevelResponse>.Success(Map(entity));
    }

    public async Task<Result<AcademicLevelResponse>> CreateAsync(CreateAcademicLevelRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Description))
            return Result<AcademicLevelResponse>.Failure(new Error("VALIDATION", "Description es obligatorio."));

        var entity = new AcademicLevel
        {
            GuidId = Guid.NewGuid(),
            Description = request.Description.Trim(),
        };

        _db.AcademicLevels.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<AcademicLevelResponse>.Success(Map(entity));
    }

    public async Task<Result<AcademicLevelResponse>> UpdateAsync(int id, UpdateAcademicLevelRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Description))
            return Result<AcademicLevelResponse>.Failure(new Error("VALIDATION", "Description es obligatorio."));

        var entity = await _db.AcademicLevels
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<AcademicLevelResponse>.Failure(new Error("NOT_FOUND", "AcademicLevel no encontrado."));

        entity.Description = request.Description.Trim();
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<AcademicLevelResponse>.Success(Map(entity));
    }

    private static AcademicLevelResponse Map(AcademicLevel e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Description = e.Description,
    };
}

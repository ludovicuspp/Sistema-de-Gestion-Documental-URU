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
            .Select(e => new AcademicLevelResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Name = e.Name,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<AcademicLevelResponse>>.Success(list);
    }

    public async Task<Result<AcademicLevelResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.AcademicLevels
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<AcademicLevelResponse>.Failure(new Error("NOT_FOUND", "AcademicLevel no encontrado."));

        return Result<AcademicLevelResponse>.Success(Map(entity));
    }

    public async Task<Result<AcademicLevelResponse>> CreateAsync(CreateAcademicLevelRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<AcademicLevelResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = new AcademicLevel
        {
            GuidId = Guid.NewGuid(),
            Name = request.Name.Trim(),
        };

        _db.AcademicLevels.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<AcademicLevelResponse>.Success(Map(entity));
    }

    public async Task<Result<AcademicLevelResponse>> UpdateAsync(Guid guidId, UpdateAcademicLevelRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<AcademicLevelResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = await _db.AcademicLevels
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<AcademicLevelResponse>.Failure(new Error("NOT_FOUND", "AcademicLevel no encontrado."));

        entity.Name = request.Name.Trim();
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<AcademicLevelResponse>.Success(Map(entity));
    }

    private static AcademicLevelResponse Map(AcademicLevel e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Name = e.Name,
    };
}

namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.Career;
using CareerEntity = Sidae.Commons.Entities.Career;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class CareerService : ICareerService
{
    private readonly AppDbContext _db;

    public CareerService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<CareerResponse>>> GetAllAsync(GetCareerRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<CareerEntity> query = _db.Careers.AsNoTracking();

        if (request is not null)
        {
            if (request.Id.HasValue)
                query = query.Where(e => e.Id == request.Id.Value);

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
            .Select(e => new CareerResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Name = e.Name,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<CareerResponse>>.Success(list);
    }

    public async Task<Result<CareerResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Careers
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<CareerResponse>.Failure(new Error("NOT_FOUND", "Career no encontrado."));

        return Result<CareerResponse>.Success(Map(entity));
    }

    public async Task<Result<CareerResponse>> CreateAsync(CreateCareerRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<CareerResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = new CareerEntity
        {
            GuidId = Guid.NewGuid(),
            Name = request.Name.Trim(),
        };

        _db.Careers.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<CareerResponse>.Success(Map(entity));
    }

    public async Task<Result<CareerResponse>> UpdateAsync(int id, UpdateCareerRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<CareerResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = await _db.Careers
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<CareerResponse>.Failure(new Error("NOT_FOUND", "Career no encontrado."));

        entity.Name = request.Name.Trim();
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<CareerResponse>.Success(Map(entity));
    }

    private static CareerResponse Map(CareerEntity e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Name = e.Name,
    };
}

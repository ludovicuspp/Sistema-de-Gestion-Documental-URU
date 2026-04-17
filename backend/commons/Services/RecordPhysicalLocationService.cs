namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.RecordPhysicalLocation;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class RecordPhysicalLocationService : IRecordPhysicalLocationService
{
    private readonly AppDbContext _db;

    public RecordPhysicalLocationService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<RecordPhysicalLocationResponse>>> GetAllAsync(GetRecordPhysicalLocationRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<RecordPhysicalLocation> query = _db.RecordPhysicalLocations.AsNoTracking();

        if (request is not null)
        {
            if (request.Id.HasValue)
                query = query.Where(e => e.Id == request.Id.Value);

            if (request.GuidId.HasValue)
                query = query.Where(e => e.GuidId == request.GuidId.Value);

            if (!string.IsNullOrWhiteSpace(request.Shelf))
            {
                var v = request.Shelf.Trim();
                query = query.Where(e => e.Shelf.Contains(v));
            }

            if (!string.IsNullOrWhiteSpace(request.Box))
            {
                var v = request.Box.Trim();
                query = query.Where(e => e.Box.Contains(v));
            }

            if (!string.IsNullOrWhiteSpace(request.Row))
            {
                var v = request.Row.Trim();
                query = query.Where(e => e.Row.Contains(v));
            }

            if (request.Capacity.HasValue)
                query = query.Where(e => e.Capacity == request.Capacity.Value);
        }

        var list = await query
            .OrderBy(e => e.Shelf).ThenBy(e => e.Box).ThenBy(e => e.Row)
            .Select(e => new RecordPhysicalLocationResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Shelf = e.Shelf,
                Box = e.Box,
                Row = e.Row,
                Capacity = e.Capacity,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<RecordPhysicalLocationResponse>>.Success(list);
    }

    public async Task<Result<RecordPhysicalLocationResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.RecordPhysicalLocations
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RecordPhysicalLocationResponse>.Failure(new Error("NOT_FOUND", "PhysicalLocation no encontrado."));

        return Result<RecordPhysicalLocationResponse>.Success(Map(entity));
    }

    public async Task<Result<RecordPhysicalLocationResponse>> CreateAsync(CreateRecordPhysicalLocationRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Shelf))
            return Result<RecordPhysicalLocationResponse>.Failure(new Error("VALIDATION", "Shelf es obligatorio."));
        if (string.IsNullOrWhiteSpace(request.Box))
            return Result<RecordPhysicalLocationResponse>.Failure(new Error("VALIDATION", "Box es obligatorio."));
        if (string.IsNullOrWhiteSpace(request.Row))
            return Result<RecordPhysicalLocationResponse>.Failure(new Error("VALIDATION", "Row es obligatorio."));

        var entity = new RecordPhysicalLocation
        {
            GuidId = Guid.NewGuid(),
            Shelf = request.Shelf.Trim(),
            Box = request.Box.Trim(),
            Row = request.Row.Trim(),
            Capacity = request.Capacity,
        };

        _db.RecordPhysicalLocations.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RecordPhysicalLocationResponse>.Success(Map(entity));
    }

    public async Task<Result<RecordPhysicalLocationResponse>> UpdateAsync(int id, UpdateRecordPhysicalLocationRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Shelf))
            return Result<RecordPhysicalLocationResponse>.Failure(new Error("VALIDATION", "Shelf es obligatorio."));
        if (string.IsNullOrWhiteSpace(request.Box))
            return Result<RecordPhysicalLocationResponse>.Failure(new Error("VALIDATION", "Box es obligatorio."));
        if (string.IsNullOrWhiteSpace(request.Row))
            return Result<RecordPhysicalLocationResponse>.Failure(new Error("VALIDATION", "Row es obligatorio."));

        var entity = await _db.RecordPhysicalLocations
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RecordPhysicalLocationResponse>.Failure(new Error("NOT_FOUND", "PhysicalLocation no encontrado."));

        entity.Shelf = request.Shelf.Trim();
        entity.Box = request.Box.Trim();
        entity.Row = request.Row.Trim();
        entity.Capacity = request.Capacity;
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RecordPhysicalLocationResponse>.Success(Map(entity));
    }

    private static RecordPhysicalLocationResponse Map(RecordPhysicalLocation e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Shelf = e.Shelf,
        Box = e.Box,
        Row = e.Row,
        Capacity = e.Capacity,
    };
}

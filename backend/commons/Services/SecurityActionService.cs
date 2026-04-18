namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.SecurityAction;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class SecurityActionService : ISecurityActionService
{
    private readonly AppDbContext _db;

    public SecurityActionService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<SecurityActionResponse>>> GetAllAsync(GetSecurityActionRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<SecurityAction> query = _db.SecurityActions.AsNoTracking();

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
            .Select(e => new SecurityActionResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Name = e.Name,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<SecurityActionResponse>>.Success(list);
    }

    public async Task<Result<SecurityActionResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.SecurityActions
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<SecurityActionResponse>.Failure(new Error("NOT_FOUND", "Security.Action no encontrado."));

        return Result<SecurityActionResponse>.Success(Map(entity));
    }

    public async Task<Result<SecurityActionResponse>> CreateAsync(CreateSecurityActionRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<SecurityActionResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = new SecurityAction
        {
            GuidId = Guid.NewGuid(),
            Name = request.Name.Trim(),
        };

        _db.SecurityActions.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<SecurityActionResponse>.Success(Map(entity));
    }

    public async Task<Result<SecurityActionResponse>> UpdateAsync(Guid guidId, UpdateSecurityActionRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<SecurityActionResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = await _db.SecurityActions
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<SecurityActionResponse>.Failure(new Error("NOT_FOUND", "Security.Action no encontrado."));

        entity.Name = request.Name.Trim();
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<SecurityActionResponse>.Success(Map(entity));
    }

    private static SecurityActionResponse Map(SecurityAction e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Name = e.Name,
    };
}

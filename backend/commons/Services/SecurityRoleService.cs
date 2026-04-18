namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.SecurityRole;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class SecurityRoleService : ISecurityRoleService
{
    private readonly AppDbContext _db;

    public SecurityRoleService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<SecurityRoleResponse>>> GetAllAsync(GetSecurityRoleRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Role> query = _db.Roles.AsNoTracking();

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
            .Select(e => new SecurityRoleResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Name = e.Name,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<SecurityRoleResponse>>.Success(list);
    }

    public async Task<Result<SecurityRoleResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Roles
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<SecurityRoleResponse>.Failure(new Error("NOT_FOUND", "Rol no encontrado."));

        return Result<SecurityRoleResponse>.Success(Map(entity));
    }

    public async Task<Result<SecurityRoleResponse>> CreateAsync(CreateSecurityRoleRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<SecurityRoleResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = new Role
        {
            GuidId = Guid.NewGuid(),
            Name = request.Name.Trim(),
        };

        _db.Roles.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<SecurityRoleResponse>.Success(Map(entity));
    }

    public async Task<Result<SecurityRoleResponse>> UpdateAsync(Guid guidId, UpdateSecurityRoleRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<SecurityRoleResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = await _db.Roles
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<SecurityRoleResponse>.Failure(new Error("NOT_FOUND", "Rol no encontrado."));

        entity.Name = request.Name.Trim();
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<SecurityRoleResponse>.Success(Map(entity));
    }

    private static SecurityRoleResponse Map(Role e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Name = e.Name,
    };
}

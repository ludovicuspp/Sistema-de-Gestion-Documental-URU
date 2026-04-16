namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.DocumentType;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class DocumentTypeService : IDocumentTypeService
{
    private readonly AppDbContext _db;

    public DocumentTypeService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<DocumentTypeResponse>>> GetAllAsync(GetDocumentTypeRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<DocumentType> query = _db.DocumentTypes.AsNoTracking();

        if (request is not null)
        {
            if (request.Id.HasValue)
                query = query.Where(e => e.Id == request.Id.Value);

            if (request.GuidId.HasValue)
                query = query.Where(e => e.GuidId == request.GuidId.Value);

            if (!string.IsNullOrWhiteSpace(request.Nombre))
            {
                var nombre = request.Nombre.Trim();
                query = query.Where(e => e.Nombre.Contains(nombre));
            }

            if (request.CreatedAt.HasValue)
                query = query.Where(e => e.CreatedAt == request.CreatedAt.Value);

            if (request.CreatedBy.HasValue)
                query = query.Where(e => e.CreatedBy == request.CreatedBy.Value);

            if (request.UpdatedAt.HasValue)
                query = query.Where(e => e.UpdatedAt == request.UpdatedAt.Value);

            if (request.UpdatedBy.HasValue)
                query = query.Where(e => e.UpdatedBy == request.UpdatedBy.Value);
        }

        var list = await query
            .OrderBy(e => e.Nombre)
            .Select(e => new DocumentTypeResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Nombre = e.Nombre,
                CreatedAt = e.CreatedAt,
                CreatedBy = e.CreatedBy,
                UpdatedAt = e.UpdatedAt,
                UpdatedBy = e.UpdatedBy
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<DocumentTypeResponse>>.Success(list);
    }

    public async Task<Result<DocumentTypeResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.DocumentTypes
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<DocumentTypeResponse>.Failure(new Error("NOT_FOUND", "DocumentType no encontrado."));

        return Result<DocumentTypeResponse>.Success(Map(entity));
    }

    public async Task<Result<DocumentTypeResponse>> CreateAsync(CreateDocumentTypeRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Nombre))
            return Result<DocumentTypeResponse>.Failure(new Error("VALIDATION", "Nombre es obligatorio."));

        var utc = DateTime.UtcNow;
        var entity = new DocumentType
        {
            GuidId = Guid.NewGuid(),
            Nombre = request.Nombre.Trim(),
            CreatedAt = utc,
        };

        _db.DocumentTypes.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<DocumentTypeResponse>.Success(Map(entity));
    }

    public async Task<Result<DocumentTypeResponse>> UpdateAsync(int id, UpdateDocumentTypeRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Nombre))
            return Result<DocumentTypeResponse>.Failure(new Error("VALIDATION", "Nombre es obligatorio."));

        var entity = await _db.DocumentTypes
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<DocumentTypeResponse>.Failure(new Error("NOT_FOUND", "DocumentType no encontrado."));

        entity.Nombre = request.Nombre.Trim();
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<DocumentTypeResponse>.Success(Map(entity));
    }

    private static DocumentTypeResponse Map(DocumentType e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Nombre = e.Nombre,
        CreatedAt = e.CreatedAt,
        CreatedBy = e.CreatedBy,
        UpdatedAt = e.UpdatedAt,
        UpdatedBy = e.UpdatedBy,
    };
}

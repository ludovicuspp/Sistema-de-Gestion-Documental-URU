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
            if (request.GuidId.HasValue)
                query = query.Where(e => e.GuidId == request.GuidId.Value);

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                var name = request.Name.Trim();
                query = query.Where(e => e.Name.Contains(name));
            }

            if (request.IsMandatory.HasValue)
                query = query.Where(e => e.IsMandatory == request.IsMandatory.Value);

            if (request.AcademicLevelId.HasValue)
            {
                var levelId = request.AcademicLevelId.Value;
                query = query.Where(e => e.TypeAcademicLevels.Any(t => t.AcademicLevelId == levelId));
            }
        }

        var entities = await query
            .Include(e => e.TypeAcademicLevels)
            .ThenInclude(t => t.AcademicLevel)
            .OrderBy(e => e.Name)
            .AsSplitQuery()
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        var list = entities.Select(Map).ToList();
        return Result<List<DocumentTypeResponse>>.Success(list);
    }

    public async Task<Result<DocumentTypeResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.DocumentTypes
            .AsNoTracking()
            .Include(e => e.TypeAcademicLevels)
            .ThenInclude(t => t.AcademicLevel)
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<DocumentTypeResponse>.Failure(new Error("NOT_FOUND", "DocumentType no encontrado."));

        return Result<DocumentTypeResponse>.Success(Map(entity));
    }

    public async Task<Result<DocumentTypeResponse>> CreateAsync(CreateDocumentTypeRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<DocumentTypeResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = new DocumentType
        {
            GuidId = Guid.NewGuid(),
            Name = request.Name.Trim(),
            IsMandatory = request.IsMandatory,
        };

        _db.DocumentTypes.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<DocumentTypeResponse>.Success(Map(entity));
    }

    public async Task<Result<DocumentTypeResponse>> UpdateAsync(Guid guidId, UpdateDocumentTypeRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<DocumentTypeResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = await _db.DocumentTypes
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<DocumentTypeResponse>.Failure(new Error("NOT_FOUND", "DocumentType no encontrado."));

        entity.Name = request.Name.Trim();
        entity.IsMandatory = request.IsMandatory;
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        var reloaded = await _db.DocumentTypes
            .AsNoTracking()
            .Include(e => e.TypeAcademicLevels)
            .ThenInclude(t => t.AcademicLevel)
            .FirstAsync(e => e.Id == entity.Id, cancellationToken)
            .ConfigureAwait(false);

        return Result<DocumentTypeResponse>.Success(Map(reloaded));
    }

    private static DocumentTypeResponse Map(DocumentType e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Name = e.Name,
        IsMandatory = e.IsMandatory,
        AcademicLevels = e.TypeAcademicLevels
            .OrderBy(x => x.AcademicLevel.Name)
            .Select(x => x.AcademicLevel.Name)
            .ToList(),
    };
}

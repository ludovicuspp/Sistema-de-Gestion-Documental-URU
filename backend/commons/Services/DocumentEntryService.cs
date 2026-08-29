namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.DocumentEntry;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class DocumentEntryService : IDocumentEntryService
{
    private readonly AppDbContext _db;

    public DocumentEntryService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<DocumentEntryResponse>>> GetAllAsync(GetDocumentEntryRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<DocumentEntry> query = _db.DocumentEntries.AsNoTracking();

        if (request is not null)
        {
            if (request.GuidId.HasValue)
                query = query.Where(e => e.GuidId == request.GuidId.Value);

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                var name = request.Name.Trim();
                query = query.Where(e => e.Name.Contains(name));
            }

            if (request.FolderId.HasValue)
                query = query.Where(e => e.FolderId == request.FolderId.Value);

            if (request.Active.HasValue)
                query = query.Where(e => e.Active == request.Active.Value);

            if (request.MimeTypeId.HasValue)
                query = query.Where(e => e.MimeTypeId == request.MimeTypeId.Value);

            if (request.DocumentTypeId.HasValue)
                query = query.Where(e => e.DocumentTypeId == request.DocumentTypeId.Value);
        }

        var list = await query
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new DocumentEntryResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Url = e.Url,
                Name = e.Name,
                Size = e.Size,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt,
                Active = e.Active,
                FolderId = e.FolderId,
                MimeTypeId = e.MimeTypeId,
                DocumentTypeId = e.DocumentTypeId,
                CreatedById = e.CreatedById,
                UpdatedById = e.UpdatedById,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<DocumentEntryResponse>>.Success(list);
    }

    public async Task<Result<DocumentEntryResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.DocumentEntries
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<DocumentEntryResponse>.Failure(new Error("NOT_FOUND", "Documento no encontrado."));

        return Result<DocumentEntryResponse>.Success(Map(entity));
    }

    public async Task<Result<DocumentEntryResponse>> CreateAsync(CreateDocumentEntryRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Url))
            return Result<DocumentEntryResponse>.Failure(new Error("VALIDATION", "Url es obligatorio."));
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<DocumentEntryResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var folderExists = await _db.RecordFolders.AnyAsync(f => f.Id == request.FolderId, cancellationToken).ConfigureAwait(false);
        if (!folderExists)
            return Result<DocumentEntryResponse>.Failure(new Error("VALIDATION", "FolderId no existe."));

        if (request.MimeTypeId.HasValue)
        {
            var ok = await _db.MimeTypes.AnyAsync(m => m.Id == request.MimeTypeId.Value, cancellationToken).ConfigureAwait(false);
            if (!ok)
                return Result<DocumentEntryResponse>.Failure(new Error("VALIDATION", "MimeTypeId no existe."));
        }

        if (request.DocumentTypeId.HasValue)
        {
            var ok = await _db.DocumentTypes.AnyAsync(t => t.Id == request.DocumentTypeId.Value, cancellationToken).ConfigureAwait(false);
            if (!ok)
                return Result<DocumentEntryResponse>.Failure(new Error("VALIDATION", "DocumentTypeId no existe."));
        }

        if (request.CreatedById.HasValue)
        {
            var ok = await _db.Users.AnyAsync(u => u.Id == request.CreatedById.Value, cancellationToken).ConfigureAwait(false);
            if (!ok)
                return Result<DocumentEntryResponse>.Failure(new Error("VALIDATION", "CreatedById no existe."));
        }

        var entity = new DocumentEntry
        {
            GuidId = Guid.NewGuid(),
            Url = request.Url.Trim(),
            Name = request.Name.Trim(),
            Size = request.Size,
            CreatedAt = DateTime.UtcNow,
            Active = true,
            FolderId = request.FolderId,
            MimeTypeId = request.MimeTypeId,
            DocumentTypeId = request.DocumentTypeId,
            CreatedById = request.CreatedById,
        };

        _db.DocumentEntries.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<DocumentEntryResponse>.Success(Map(entity));
    }

    public async Task<Result<DocumentEntryResponse>> UpdateAsync(Guid guidId, UpdateDocumentEntryRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Url))
            return Result<DocumentEntryResponse>.Failure(new Error("VALIDATION", "Url es obligatorio."));
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<DocumentEntryResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = await _db.DocumentEntries
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<DocumentEntryResponse>.Failure(new Error("NOT_FOUND", "Documento no encontrado."));

        if (request.MimeTypeId.HasValue)
        {
            var ok = await _db.MimeTypes.AnyAsync(m => m.Id == request.MimeTypeId.Value, cancellationToken).ConfigureAwait(false);
            if (!ok)
                return Result<DocumentEntryResponse>.Failure(new Error("VALIDATION", "MimeTypeId no existe."));
        }

        if (request.DocumentTypeId.HasValue)
        {
            var ok = await _db.DocumentTypes.AnyAsync(t => t.Id == request.DocumentTypeId.Value, cancellationToken).ConfigureAwait(false);
            if (!ok)
                return Result<DocumentEntryResponse>.Failure(new Error("VALIDATION", "DocumentTypeId no existe."));
        }

        if (request.UpdatedById.HasValue)
        {
            var ok = await _db.Users.AnyAsync(u => u.Id == request.UpdatedById.Value, cancellationToken).ConfigureAwait(false);
            if (!ok)
                return Result<DocumentEntryResponse>.Failure(new Error("VALIDATION", "UpdatedById no existe."));
        }

        entity.Url = request.Url.Trim();
        entity.Name = request.Name.Trim();
        entity.Size = request.Size;
        entity.Active = request.Active;
        entity.MimeTypeId = request.MimeTypeId;
        entity.DocumentTypeId = request.DocumentTypeId;
        entity.UpdatedById = request.UpdatedById;
        entity.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<DocumentEntryResponse>.Success(Map(entity));
    }

    private static DocumentEntryResponse Map(DocumentEntry e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Url = e.Url,
        Name = e.Name,
        Size = e.Size,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt,
        Active = e.Active,
        FolderId = e.FolderId,
        MimeTypeId = e.MimeTypeId,
        DocumentTypeId = e.DocumentTypeId,
        CreatedById = e.CreatedById,
        UpdatedById = e.UpdatedById,
    };
}

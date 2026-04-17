namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.RequestDocumentType;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class RequestDocumentTypeService : IRequestDocumentTypeService
{
    private readonly AppDbContext _db;

    public RequestDocumentTypeService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<RequestDocumentTypeResponse>>> GetAllAsync(GetRequestDocumentTypeRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<RequestDocumentType> query = _db.RequestDocumentTypes.AsNoTracking();

        if (request is not null)
        {
            if (request.Id.HasValue)
                query = query.Where(e => e.Id == request.Id.Value);

            if (request.GuidId.HasValue)
                query = query.Where(e => e.GuidId == request.GuidId.Value);

            if (request.RequestId.HasValue)
                query = query.Where(e => e.RequestId == request.RequestId.Value);

            if (request.DocumentTypeId.HasValue)
                query = query.Where(e => e.DocumentTypeId == request.DocumentTypeId.Value);
        }

        var list = await query
            .OrderBy(e => e.RequestId).ThenBy(e => e.DocumentTypeId)
            .Select(e => new RequestDocumentTypeResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                RequestId = e.RequestId,
                DocumentTypeId = e.DocumentTypeId,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<RequestDocumentTypeResponse>>.Success(list);
    }

    public async Task<Result<RequestDocumentTypeResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.RequestDocumentTypes
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RequestDocumentTypeResponse>.Failure(new Error("NOT_FOUND", "Request.DocumentType no encontrado."));

        return Result<RequestDocumentTypeResponse>.Success(Map(entity));
    }

    public async Task<Result<RequestDocumentTypeResponse>> CreateAsync(CreateRequestDocumentTypeRequest request, CancellationToken cancellationToken = default)
    {
        var entity = new RequestDocumentType
        {
            GuidId = Guid.NewGuid(),
            RequestId = request.RequestId,
            DocumentTypeId = request.DocumentTypeId,
        };

        _db.RequestDocumentTypes.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RequestDocumentTypeResponse>.Success(Map(entity));
    }

    public async Task<Result<RequestDocumentTypeResponse>> UpdateAsync(int id, UpdateRequestDocumentTypeRequest request, CancellationToken cancellationToken = default)
    {
        var entity = await _db.RequestDocumentTypes
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<RequestDocumentTypeResponse>.Failure(new Error("NOT_FOUND", "Request.DocumentType no encontrado."));

        entity.RequestId = request.RequestId;
        entity.DocumentTypeId = request.DocumentTypeId;
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<RequestDocumentTypeResponse>.Success(Map(entity));
    }

    private static RequestDocumentTypeResponse Map(RequestDocumentType e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        RequestId = e.RequestId,
        DocumentTypeId = e.DocumentTypeId,
    };
}

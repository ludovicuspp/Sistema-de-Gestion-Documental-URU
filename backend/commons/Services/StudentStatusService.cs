namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.StudentStatus;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class StudentStatusService : IStudentStatusService
{
    private readonly AppDbContext _db;

    public StudentStatusService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<StudentStatusResponse>>> GetAllAsync(GetStudentStatusRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<StudentStatus> query = _db.StudentStatuses.AsNoTracking();

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
            .Select(e => new StudentStatusResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Name = e.Name,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<StudentStatusResponse>>.Success(list);
    }

    public async Task<Result<StudentStatusResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.StudentStatuses
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<StudentStatusResponse>.Failure(new Error("NOT_FOUND", "Student.Status no encontrado."));

        return Result<StudentStatusResponse>.Success(Map(entity));
    }

    public async Task<Result<StudentStatusResponse>> CreateAsync(CreateStudentStatusRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<StudentStatusResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = new StudentStatus
        {
            GuidId = Guid.NewGuid(),
            Name = request.Name.Trim(),
        };

        _db.StudentStatuses.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<StudentStatusResponse>.Success(Map(entity));
    }

    public async Task<Result<StudentStatusResponse>> UpdateAsync(Guid guidId, UpdateStudentStatusRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<StudentStatusResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = await _db.StudentStatuses
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<StudentStatusResponse>.Failure(new Error("NOT_FOUND", "Student.Status no encontrado."));

        entity.Name = request.Name.Trim();
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<StudentStatusResponse>.Success(Map(entity));
    }

    private static StudentStatusResponse Map(StudentStatus e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Name = e.Name,
    };
}

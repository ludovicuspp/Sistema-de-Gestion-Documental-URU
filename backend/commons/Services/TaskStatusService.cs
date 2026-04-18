namespace Sidae.Commons.Services;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Dtos.TaskStatus;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;

public sealed class TaskStatusService : ITaskStatusService
{
    private readonly AppDbContext _db;

    public TaskStatusService(AppDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<Result<List<TaskStatusResponse>>> GetAllAsync(GetTaskStatusRequest? request = null, CancellationToken cancellationToken = default)
    {
        IQueryable<TaskStatus> query = _db.TaskStatuses.AsNoTracking();

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
            .Select(e => new TaskStatusResponse
            {
                Id = e.Id,
                GuidId = e.GuidId,
                Name = e.Name,
            })
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result<List<TaskStatusResponse>>.Success(list);
    }

    public async Task<Result<TaskStatusResponse>> GetByIdAsync(Guid guidId, CancellationToken cancellationToken = default)
    {
        var entity = await _db.TaskStatuses
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<TaskStatusResponse>.Failure(new Error("NOT_FOUND", "Task.Status no encontrado."));

        return Result<TaskStatusResponse>.Success(Map(entity));
    }

    public async Task<Result<TaskStatusResponse>> CreateAsync(CreateTaskStatusRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<TaskStatusResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = new TaskStatus
        {
            GuidId = Guid.NewGuid(),
            Name = request.Name.Trim(),
        };

        _db.TaskStatuses.Add(entity);
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<TaskStatusResponse>.Success(Map(entity));
    }

    public async Task<Result<TaskStatusResponse>> UpdateAsync(Guid guidId, UpdateTaskStatusRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<TaskStatusResponse>.Failure(new Error("VALIDATION", "Name es obligatorio."));

        var entity = await _db.TaskStatuses
            .FirstOrDefaultAsync(e => e.GuidId == guidId, cancellationToken)
            .ConfigureAwait(false);

        if (entity is null)
            return Result<TaskStatusResponse>.Failure(new Error("NOT_FOUND", "Task.Status no encontrado."));

        entity.Name = request.Name.Trim();
        await _db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<TaskStatusResponse>.Success(Map(entity));
    }

    private static TaskStatusResponse Map(TaskStatus e) => new()
    {
        Id = e.Id,
        GuidId = e.GuidId,
        Name = e.Name,
    };
}

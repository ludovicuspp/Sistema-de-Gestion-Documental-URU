namespace Sidae.Commons.DataAccess;

using System.Collections.Concurrent;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Sidae.Commons.Entities;
using Sidae.Commons.Interfaces;

/// <summary>
/// Rellena CreatedAt/CreatedBy en altas y UpdatedAt/UpdatedBy en modificaciones.
/// </summary>
public sealed class AuditSaveChangesInterceptor : SaveChangesInterceptor
{
    private readonly ICurrentUserAccessor _currentUserAccessor;
    private static readonly ConcurrentDictionary<Type, AuditPropertyBindings?> BindingsCache = new();

    public AuditSaveChangesInterceptor(ICurrentUserAccessor currentUserAccessor)
    {
        _currentUserAccessor = currentUserAccessor ?? throw new ArgumentNullException(nameof(currentUserAccessor));
    }

    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        ApplyAudit(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        ApplyAudit(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void ApplyAudit(DbContext? context)
    {
        if (context is null)
            return;

        var personId = _currentUserAccessor.GetCurrentPersonId();
        var utcNow = DateTime.UtcNow;

        foreach (var entry in context.ChangeTracker.Entries())
        {
            if (entry.Entity is null || entry.State is EntityState.Detached or EntityState.Unchanged)
                continue;

            var bindings = BindingsCache.GetOrAdd(entry.Entity.GetType(), ResolveAuditBindings);
            if (bindings is null || !bindings.HasAny)
                continue;

            if (entry.State == EntityState.Added)
            {
                if (bindings.CreatedAt is not null)
                    bindings.CreatedAt.SetValue(entry.Entity, utcNow);
                if (bindings.CreatedBy is not null && personId.HasValue)
                    bindings.CreatedBy.SetValue(entry.Entity, personId);
            }
            else if (entry.State == EntityState.Modified)
            {
                if (bindings.UpdatedAt is not null)
                    bindings.UpdatedAt.SetValue(entry.Entity, utcNow);
                if (bindings.UpdatedBy is not null && personId.HasValue)
                    bindings.UpdatedBy.SetValue(entry.Entity, personId);
            }
        }
    }

    private static AuditPropertyBindings? ResolveAuditBindings(Type type)
    {
        const BindingFlags flags = BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy;
        var props = type.GetProperties(flags);
        PropertyInfo? createdAt = null;
        PropertyInfo? createdBy = null;
        PropertyInfo? updatedAt = null;
        PropertyInfo? updatedBy = null;

        foreach (var p in props)
        {
            if (p.Name == nameof(DocumentType.CreatedAt) && p.PropertyType == typeof(DateTime) && p.CanWrite)
                createdAt = p;
            else if (p.Name == nameof(DocumentType.CreatedBy) && p.PropertyType == typeof(int?) && p.CanWrite)
                createdBy = p;
            else if (p.Name == nameof(DocumentType.UpdatedAt) && p.PropertyType == typeof(DateTime?) && p.CanWrite)
                updatedAt = p;
            else if (p.Name == nameof(DocumentType.UpdatedBy) && p.PropertyType == typeof(int?) && p.CanWrite)
                updatedBy = p;
        }

        var b = new AuditPropertyBindings(createdAt, createdBy, updatedAt, updatedBy);
        return b.HasAny ? b : null;
    }

    private sealed record AuditPropertyBindings(
        PropertyInfo? CreatedAt,
        PropertyInfo? CreatedBy,
        PropertyInfo? UpdatedAt,
        PropertyInfo? UpdatedBy)
    {
        public bool HasAny => CreatedAt is not null || CreatedBy is not null || UpdatedAt is not null || UpdatedBy is not null;
    }
}

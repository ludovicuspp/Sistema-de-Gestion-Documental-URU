# Performance Guidelines

## Async/Await

### Best Practices
- Always use async/await for I/O operations
- Don't use `.Result` or `.Wait()` - use `await`
- Use `ConfigureAwait(false)` for library code
- Avoid blocking operations in async methods

### Async Pattern Examples
```csharp
// Good - Proper async/await usage
public async Task<Result<EntityDto>> Handle(CreateEntityCommand request, CancellationToken cancellationToken)
{
    var entity = await dbContext.Entity.AddAsync(request.Entity, cancellationToken);
    await dbContext.SaveChangesAsync(cancellationToken);
    
    var dto = _mapper.Map<EntityDto>(entity);
    return Result<EntityDto>.Success(dto);
}

// Bad - Blocking operations
public async Task<Result<EntityDto>> Handle(CreateEntityCommand request, CancellationToken cancellationToken)
{
    var entity = dbContext.Entity.AddAsync(request.Entity, cancellationToken).Result; // Don't do this
    dbContext.SaveChangesAsync(cancellationToken).Wait(); // Don't do this
    
    var dto = _mapper.Map<EntityDto>(entity);
    return Result<EntityDto>.Success(dto);
}
```

## Caching

### Caching Strategy
- Use `ICacheService` for caching frequently accessed data
- Cache expensive operations
- Use appropriate cache expiration times
- Implement cache invalidation strategies

### Caching Implementation
```csharp
public async Task<List<EntityDto>> GetEntities([Service] ICacheService cache)
{
    var cacheKey = "entities:all";
    var cachedEntities = await cache.GetAsync<List<EntityDto>>(cacheKey);
    
    if (cachedEntities != null)
    {
        return cachedEntities;
    }
    
    var entities = await dbContext.Entity.GetAllAsync(cancellationToken: CancellationToken.None);
    var dtos = _mapper.Map<List<EntityDto>>(entities);
    
    await cache.SetAsync(cacheKey, dtos, TimeSpan.FromMinutes(30));
    return dtos;
}
```

## Database Optimization

### Query Optimization
- Use `AsSplitQuery()` for complex queries with multiple includes
- Use `AsNoTracking()` for read-only operations
- Use projection to select only required fields
- Use `Where()` clauses early in the query chain

### Query Examples
```csharp
// Good - Optimized query
public async Task<List<EntityDto>> GetActiveEntitiesAsync(CancellationToken cancellationToken)
{
    return await dbContext.Entity
        .GetAllAsync(
            predicate: e => e.IsActive,
            include: null,
            sortPredicate: new Dictionary<string, Expression<Func<Entity, dynamic>>>
            {
                { "Name", e => e.Name }
            },
            skip: 0,
            take: 100,
            cancellationToken);
}

// Bad - Inefficient query
public async Task<List<EntityDto>> GetActiveEntitiesAsync(CancellationToken cancellationToken)
{
    var allEntities = await dbContext.Entity.GetAllAsync(cancellationToken: cancellationToken);
    return allEntities.Where(e => e.IsActive).ToList(); // Don't load all entities
}
```

### Connection Management
- Use connection pooling
- Dispose of database contexts properly
- Use async/await for all database operations
- Implement proper retry logic for transient failures

## Memory Management

### Object Lifecycle
- Dispose of resources properly
- Use `using` statements for disposable objects
- Avoid memory leaks in long-running processes
- Monitor memory usage in production

## Performance Monitoring

### Metrics to Track
- Response times for API endpoints
- Database query execution times
- Memory usage patterns
- CPU utilization
- Cache hit/miss ratios

### Performance Testing
- Use load testing tools
- Test with realistic data volumes
- Monitor performance under stress
- Set performance benchmarks

## Optimization Techniques

### Lazy Loading
- Use lazy loading for related entities when appropriate
- Avoid N+1 query problems
- Use eager loading for frequently accessed related data

### Pagination
- Implement proper pagination for large datasets
- Use cursor-based pagination for better performance
- Limit page sizes to reasonable values

### Background Processing
- Use background services for long-running operations
- Implement proper job queuing
- Use SignalR for real-time updates

## Configuration Optimization

### Application Settings
- Use appropriate thread pool settings
- Configure connection pool sizes
- Set proper timeout values
- Optimize garbage collection settings

### Environment-Specific Optimization
- Use different settings for development and production
- Implement feature flags for performance testing
- Use staging environments for performance validation

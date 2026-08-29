namespace Sidae.Commons.Services;

using Microsoft.Extensions.Caching.Memory;
using Sidae.Commons.Interfaces;

public sealed class CacheService : ICacheService
{
    private readonly IMemoryCache _cache;

    public CacheService(IMemoryCache cache)
    {
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
    }

    public T? Get<T>(string key)
        where T : class
    {
        return _cache.Get<T>(key);
    }

    public void Set<T>(string key, T value, TimeSpan? absoluteExpirationRelativeToNow = null)
        where T : class
    {
        var options = new MemoryCacheEntryOptions();
        if (absoluteExpirationRelativeToNow.HasValue)
            options.SetAbsoluteExpiration(absoluteExpirationRelativeToNow.Value);

        _cache.Set(key, value, options);
    }

    public void Remove(string key) => _cache.Remove(key);
}

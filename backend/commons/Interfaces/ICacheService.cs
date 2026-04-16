namespace Sidae.Commons.Interfaces;

/// <summary>
/// Caché en memoria (envuelve <see cref="Microsoft.Extensions.Caching.Memory.IMemoryCache"/>).
/// </summary>
public interface ICacheService
{
    T? Get<T>(string key)
        where T : class;

    void Set<T>(string key, T value, TimeSpan? absoluteExpirationRelativeToNow = null)
        where T : class;

    void Remove(string key);
}

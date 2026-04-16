namespace Sidae.Commons.Services;

using Sidae.Commons.Interfaces;

public sealed class UnconfiguredCloudflareR2StorageService : ICloudflareR2StorageService
{
    private static InvalidOperationException Error() =>
        new("Cloudflare R2 is not configured. Please set CloudflareR2 settings.");

    public Task<string> UploadAsync(
        string objectKey,
        Stream content,
        string contentType,
        CancellationToken cancellationToken = default) => Task.FromException<string>(Error());

    public Task<Stream> DownloadAsync(
        string objectKey,
        CancellationToken cancellationToken = default) => Task.FromException<Stream>(Error());

    public Task DeleteAsync(
        string objectKey,
        CancellationToken cancellationToken = default) => Task.FromException(Error());
}

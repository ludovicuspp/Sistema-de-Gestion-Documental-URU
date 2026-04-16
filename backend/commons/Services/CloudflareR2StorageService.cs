namespace Sidae.Commons.Services;

using Amazon.S3;
using Amazon.S3.Model;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Settings;

public sealed class CloudflareR2StorageService : ICloudflareR2StorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly CloudflareR2Settings _options;

    public CloudflareR2StorageService(IAmazonS3 s3Client, CloudflareR2Settings options)
    {
        _s3Client = s3Client ?? throw new ArgumentNullException(nameof(s3Client));
        _options = options ?? throw new ArgumentNullException(nameof(options));
    }

    public async Task<string> UploadAsync(
        string objectKey,
        Stream content,
        string contentType,
        CancellationToken cancellationToken = default)
    {
        var putRequest = new PutObjectRequest
        {
            BucketName = _options.BucketName,
            Key = objectKey,
            InputStream = content,
            AutoCloseStream = false,
            ContentType = contentType
        };

        await _s3Client.PutObjectAsync(putRequest, cancellationToken).ConfigureAwait(false);
        return BuildPublicUrl(objectKey);
    }

    public async Task<Stream> DownloadAsync(string objectKey, CancellationToken cancellationToken = default)
    {
        var response = await _s3Client.GetObjectAsync(_options.BucketName, objectKey, cancellationToken).ConfigureAwait(false);
        var memoryStream = new MemoryStream();
        await response.ResponseStream.CopyToAsync(memoryStream, cancellationToken).ConfigureAwait(false);
        memoryStream.Position = 0;
        return memoryStream;
    }

    public Task DeleteAsync(string objectKey, CancellationToken cancellationToken = default)
    {
        return _s3Client.DeleteObjectAsync(_options.BucketName, objectKey, cancellationToken);
    }

    private string BuildPublicUrl(string objectKey)
    {
        if (string.IsNullOrWhiteSpace(_options.PublicBaseUrl))
            return objectKey;

        return $"{_options.PublicBaseUrl.TrimEnd('/')}/{objectKey}";
    }
}

namespace Sidae.Sidae.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using global::Sidae.Commons.Dtos.RecordFolder;
using global::Sidae.Commons.Interfaces;
using global::Sidae.Commons.Patterns;
using global::Sidae.Sidae.Helpers;

[ApiController]
[Route("api/v1/record/folders")]
[Authorize]
public sealed class RecordFolderController(
    IRecordFolderService service,
    ICacheService cacheService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(Result<List<RecordFolderResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetRecordFolderRequest? request, CancellationToken cancellationToken)
    {
        var hasFilters = request is not null &&
                         (request.Id.HasValue
                          || request.GuidId.HasValue
                          || !string.IsNullOrWhiteSpace(request.Description)
                          || request.StudentId.HasValue
                          || request.FolderStatusId.HasValue
                          || request.FolderTypeId.HasValue
                          || request.PhysicalLocationId.HasValue
                          || request.CreatedById.HasValue);

        if (!hasFilters)
        {
            var cached = cacheService.Get<Result<List<RecordFolderResponse>>>(CatalogCacheKey.RecordFoldersAll);
            if (cached is { Ok: true })
                return Ok(cached);
        }

        var result = await service.GetAllAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok && !hasFilters)
            cacheService.Set(CatalogCacheKey.RecordFoldersAll, result, CatalogCacheKey.DefaultTtl);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(Result<RecordFolderResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await service.GetByIdAsync(id, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Result<RecordFolderResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] CreateRecordFolderRequest request, CancellationToken cancellationToken)
    {
        var result = await service.CreateAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.RecordFoldersAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(Result<RecordFolderResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRecordFolderRequest request, CancellationToken cancellationToken)
    {
        var result = await service.UpdateAsync(id, request, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.RecordFoldersAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }
}

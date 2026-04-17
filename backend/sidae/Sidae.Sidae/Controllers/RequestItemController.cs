namespace Sidae.Sidae.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using global::Sidae.Commons.Dtos.RequestItem;
using global::Sidae.Commons.Interfaces;
using global::Sidae.Commons.Patterns;
using global::Sidae.Sidae.Helpers;

[ApiController]
[Route("api/v1/request/items")]
[Authorize]
public sealed class RequestItemController(
    IRequestItemService service,
    ICacheService cacheService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(Result<List<RequestItemResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetRequestItemRequest? request, CancellationToken cancellationToken)
    {
        var hasFilters = request is not null &&
                         (request.Id.HasValue
                          || request.GuidId.HasValue
                          || !string.IsNullOrWhiteSpace(request.EmailContact)
                          || !string.IsNullOrWhiteSpace(request.TrackingCode)
                          || request.StudentId.HasValue
                          || request.StatusRequestId.HasValue);

        if (!hasFilters)
        {
            var cached = cacheService.Get<Result<List<RequestItemResponse>>>(CatalogCacheKey.RequestItemsAll);
            if (cached is { Ok: true })
                return Ok(cached);
        }

        var result = await service.GetAllAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok && !hasFilters)
            cacheService.Set(CatalogCacheKey.RequestItemsAll, result, CatalogCacheKey.DefaultTtl);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(Result<RequestItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await service.GetByIdAsync(id, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Result<RequestItemResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] CreateRequestItemRequest request, CancellationToken cancellationToken)
    {
        var result = await service.CreateAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.RequestItemsAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(Result<RequestItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRequestItemRequest request, CancellationToken cancellationToken)
    {
        var result = await service.UpdateAsync(id, request, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.RequestItemsAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }
}

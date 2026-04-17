namespace Sidae.Sidae.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using global::Sidae.Commons.Dtos.RequestStatus;
using global::Sidae.Commons.Interfaces;
using global::Sidae.Commons.Patterns;
using global::Sidae.Sidae.Helpers;

[ApiController]
[Route("api/v1/request/statuses")]
[Authorize]
public sealed class RequestStatusController(
    IRequestStatusService service,
    ICacheService cacheService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(Result<List<RequestStatusResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetRequestStatusRequest? request, CancellationToken cancellationToken)
    {
        var hasFilters = request is not null &&
                         (request.Id.HasValue
                          || request.GuidId.HasValue
                          || !string.IsNullOrWhiteSpace(request.Description));

        if (!hasFilters)
        {
            var cached = cacheService.Get<Result<List<RequestStatusResponse>>>(CatalogCacheKey.RequestStatusesAll);
            if (cached is { Ok: true })
                return Ok(cached);
        }

        var result = await service.GetAllAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok && !hasFilters)
            cacheService.Set(CatalogCacheKey.RequestStatusesAll, result, CatalogCacheKey.DefaultTtl);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(Result<RequestStatusResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await service.GetByIdAsync(id, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Result<RequestStatusResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] CreateRequestStatusRequest request, CancellationToken cancellationToken)
    {
        var result = await service.CreateAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.RequestStatusesAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(Result<RequestStatusResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRequestStatusRequest request, CancellationToken cancellationToken)
    {
        var result = await service.UpdateAsync(id, request, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.RequestStatusesAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }
}

namespace Sidae.Sidae.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using global::Sidae.Commons.Dtos.RecordPhysicalLocation;
using global::Sidae.Commons.Interfaces;
using global::Sidae.Commons.Patterns;
using global::Sidae.Sidae.Helpers;

[ApiController]
[Route("api/v1/record/physical-locations")]
[Authorize]
public sealed class RecordPhysicalLocationController(
    IRecordPhysicalLocationService service,
    ICacheService cacheService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(Result<List<RecordPhysicalLocationResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetRecordPhysicalLocationRequest? request, CancellationToken cancellationToken)
    {
        var hasFilters = request is not null &&
                         (request.GuidId.HasValue
                          || !string.IsNullOrWhiteSpace(request.Shelf)
                          || !string.IsNullOrWhiteSpace(request.Box)
                          || !string.IsNullOrWhiteSpace(request.Row)
                          || request.Capacity.HasValue);

        if (!hasFilters)
        {
            var cached = cacheService.Get<Result<List<RecordPhysicalLocationResponse>>>(CatalogCacheKey.RecordPhysicalLocationsAll);
            if (cached is { Ok: true })
                return Ok(cached);
        }

        var result = await service.GetAllAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok && !hasFilters)
            cacheService.Set(CatalogCacheKey.RecordPhysicalLocationsAll, result, CatalogCacheKey.DefaultTtl);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpGet("{guidId:guid}")]
    [ProducesResponseType(typeof(Result<RecordPhysicalLocationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid guidId, CancellationToken cancellationToken)
    {
        var result = await service.GetByIdAsync(guidId, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Result<RecordPhysicalLocationResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] CreateRecordPhysicalLocationRequest request, CancellationToken cancellationToken)
    {
        var result = await service.CreateAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.RecordPhysicalLocationsAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{guidId:guid}")]
    [ProducesResponseType(typeof(Result<RecordPhysicalLocationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid guidId, [FromBody] UpdateRecordPhysicalLocationRequest request, CancellationToken cancellationToken)
    {
        var result = await service.UpdateAsync(guidId, request, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.RecordPhysicalLocationsAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }
}

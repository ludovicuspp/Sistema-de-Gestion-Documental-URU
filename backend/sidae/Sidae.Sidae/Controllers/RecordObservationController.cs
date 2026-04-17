namespace Sidae.Sidae.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using global::Sidae.Commons.Dtos.RecordObservation;
using global::Sidae.Commons.Interfaces;
using global::Sidae.Commons.Patterns;
using global::Sidae.Sidae.Helpers;

[ApiController]
[Route("api/v1/record/observations")]
[Authorize]
public sealed class RecordObservationController(
    IRecordObservationService service,
    ICacheService cacheService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(Result<List<RecordObservationResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetRecordObservationRequest? request, CancellationToken cancellationToken)
    {
        var hasFilters = request is not null &&
                         (request.Id.HasValue
                          || request.GuidId.HasValue
                          || !string.IsNullOrWhiteSpace(request.Comment)
                          || request.IsResolved.HasValue
                          || request.FolderId.HasValue
                          || request.DocumentId.HasValue
                          || request.AuthorId.HasValue);

        if (!hasFilters)
        {
            var cached = cacheService.Get<Result<List<RecordObservationResponse>>>(CatalogCacheKey.RecordObservationsAll);
            if (cached is { Ok: true })
                return Ok(cached);
        }

        var result = await service.GetAllAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok && !hasFilters)
            cacheService.Set(CatalogCacheKey.RecordObservationsAll, result, CatalogCacheKey.DefaultTtl);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(Result<RecordObservationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await service.GetByIdAsync(id, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Result<RecordObservationResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] CreateRecordObservationRequest request, CancellationToken cancellationToken)
    {
        var result = await service.CreateAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.RecordObservationsAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(Result<RecordObservationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRecordObservationRequest request, CancellationToken cancellationToken)
    {
        var result = await service.UpdateAsync(id, request, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.RecordObservationsAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }
}

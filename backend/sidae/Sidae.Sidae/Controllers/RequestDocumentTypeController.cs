namespace Sidae.Sidae.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using global::Sidae.Commons.Dtos.RequestDocumentType;
using global::Sidae.Commons.Interfaces;
using global::Sidae.Commons.Patterns;
using global::Sidae.Sidae.Helpers;

[ApiController]
[Route("api/v1/request/request-document-types")]
[Authorize]
public sealed class RequestDocumentTypeController(
    IRequestDocumentTypeService service,
    ICacheService cacheService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(Result<List<RequestDocumentTypeResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetRequestDocumentTypeRequest? request, CancellationToken cancellationToken)
    {
        var hasFilters = request is not null &&
                         (request.GuidId.HasValue
                          || request.RequestId.HasValue
                          || request.DocumentTypeId.HasValue);

        if (!hasFilters)
        {
            var cached = cacheService.Get<Result<List<RequestDocumentTypeResponse>>>(CatalogCacheKey.RequestDocumentTypesAll);
            if (cached is { Ok: true })
                return Ok(cached);
        }

        var result = await service.GetAllAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok && !hasFilters)
            cacheService.Set(CatalogCacheKey.RequestDocumentTypesAll, result, CatalogCacheKey.DefaultTtl);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpGet("{guidId:guid}")]
    [ProducesResponseType(typeof(Result<RequestDocumentTypeResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid guidId, CancellationToken cancellationToken)
    {
        var result = await service.GetByIdAsync(guidId, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Result<RequestDocumentTypeResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] CreateRequestDocumentTypeRequest request, CancellationToken cancellationToken)
    {
        var result = await service.CreateAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.RequestDocumentTypesAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{guidId:guid}")]
    [ProducesResponseType(typeof(Result<RequestDocumentTypeResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid guidId, [FromBody] UpdateRequestDocumentTypeRequest request, CancellationToken cancellationToken)
    {
        var result = await service.UpdateAsync(guidId, request, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.RequestDocumentTypesAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }
}

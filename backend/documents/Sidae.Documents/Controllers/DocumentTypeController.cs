namespace Sidae.Documents.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sidae.Commons.Dtos.DocumentType;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;
using Sidae.Documents.Helpers;

[ApiController]
[Route("api/v1/document-types")]
[Authorize]
public sealed class DocumentTypeController(
    IDocumentTypeService documentTypeService,
    ICacheService cacheService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(Result<List<DocumentTypeResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetDocumentTypeRequest? request, CancellationToken cancellationToken)
    {
        var hasFilters = request is not null &&
                         (request.GuidId.HasValue
                          || !string.IsNullOrWhiteSpace(request.Name)
                          || request.IsRequired.HasValue
                          || request.AcademicLevelId.HasValue);

        if (!hasFilters)
        {
            var cached = cacheService.Get<Result<List<DocumentTypeResponse>>>(CatalogCacheKey.DocumentTypesAll);
            if (cached is { Ok: true })
                return Ok(cached);
        }

        var result = await documentTypeService.GetAllAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok && !hasFilters)
            cacheService.Set(CatalogCacheKey.DocumentTypesAll, result, CatalogCacheKey.DefaultTtl);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpGet("{guidId:guid}")]
    [ProducesResponseType(typeof(Result<DocumentTypeResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid guidId, CancellationToken cancellationToken)
    {
        var result = await documentTypeService.GetByIdAsync(guidId, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Result<DocumentTypeResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] CreateDocumentTypeRequest request, CancellationToken cancellationToken)
    {
        var result = await documentTypeService.CreateAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.DocumentTypesAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{guidId:guid}")]
    [ProducesResponseType(typeof(Result<DocumentTypeResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid guidId, [FromBody] UpdateDocumentTypeRequest request, CancellationToken cancellationToken)
    {
        var result = await documentTypeService.UpdateAsync(guidId, request, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.DocumentTypesAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }
}

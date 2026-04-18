namespace Sidae.Documents.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sidae.Commons.Dtos.AcademicLevel;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;
using Sidae.Documents.Helpers;

[ApiController]
[Route("api/v1/academic-levels")]
[Authorize]
public sealed class AcademicLevelController(
    IAcademicLevelService academicLevelService,
    ICacheService cacheService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(Result<List<AcademicLevelResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetAcademicLevelRequest? request, CancellationToken cancellationToken)
    {
        var hasFilters = request is not null &&
                         (request.GuidId.HasValue
                          || !string.IsNullOrWhiteSpace(request.Name));

        if (!hasFilters)
        {
            var cached = cacheService.Get<Result<List<AcademicLevelResponse>>>(CatalogCacheKey.AcademicLevelsAll);
            if (cached is { Ok: true })
                return Ok(cached);
        }

        var result = await academicLevelService.GetAllAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok && !hasFilters)
            cacheService.Set(CatalogCacheKey.AcademicLevelsAll, result, CatalogCacheKey.DefaultTtl);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpGet("{guidId:guid}")]
    [ProducesResponseType(typeof(Result<AcademicLevelResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid guidId, CancellationToken cancellationToken)
    {
        var result = await academicLevelService.GetByIdAsync(guidId, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Result<AcademicLevelResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] CreateAcademicLevelRequest request, CancellationToken cancellationToken)
    {
        var result = await academicLevelService.CreateAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.AcademicLevelsAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{guidId:guid}")]
    [ProducesResponseType(typeof(Result<AcademicLevelResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid guidId, [FromBody] UpdateAcademicLevelRequest request, CancellationToken cancellationToken)
    {
        var result = await academicLevelService.UpdateAsync(guidId, request, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.AcademicLevelsAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }
}

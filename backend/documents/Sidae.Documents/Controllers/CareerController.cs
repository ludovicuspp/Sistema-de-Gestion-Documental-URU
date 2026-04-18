namespace Sidae.Documents.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sidae.Commons.Dtos.Career;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;
using Sidae.Documents.Helpers;

[ApiController]
[Route("api/v1/careers")]
[Authorize]
public sealed class CareerController(
    ICareerService careerService,
    ICacheService cacheService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(Result<List<CareerResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetCareerRequest? request, CancellationToken cancellationToken)
    {
        var hasFilters = request is not null &&
                         (request.GuidId.HasValue
                          || !string.IsNullOrWhiteSpace(request.Name));

        if (!hasFilters)
        {
            var cached = cacheService.Get<Result<List<CareerResponse>>>(CatalogCacheKey.CareersAll);
            if (cached is { Ok: true })
                return Ok(cached);
        }

        var result = await careerService.GetAllAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok && !hasFilters)
            cacheService.Set(CatalogCacheKey.CareersAll, result, CatalogCacheKey.DefaultTtl);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpGet("{guidId:guid}")]
    [ProducesResponseType(typeof(Result<CareerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid guidId, CancellationToken cancellationToken)
    {
        var result = await careerService.GetByIdAsync(guidId, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Result<CareerResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] CreateCareerRequest request, CancellationToken cancellationToken)
    {
        var result = await careerService.CreateAsync(request, cancellationToken).ConfigureAwait(false);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.CareersAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{guidId:guid}")]
    [ProducesResponseType(typeof(Result<CareerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid guidId, [FromBody] UpdateCareerRequest request, CancellationToken cancellationToken)
    {
        var result = await careerService.UpdateAsync(guidId, request, cancellationToken).ConfigureAwait(false);
        if (!result.Ok && result.Error?.Code == "NOT_FOUND")
            return NotFound(result);
        if (result.Ok)
            cacheService.Remove(CatalogCacheKey.CareersAll);

        return result.Ok ? Ok(result) : BadRequest(result);
    }
}

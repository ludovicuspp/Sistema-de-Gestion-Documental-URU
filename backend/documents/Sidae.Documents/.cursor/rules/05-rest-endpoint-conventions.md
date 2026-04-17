# REST Endpoint Conventions

This document outlines the conventions and patterns for REST API endpoints in the IMG.CLB.PT project.

## 📁 Controller Structure

### File Organization
Controllers are organized by version in the following structure:
```
IMG.CLB.PT/Controllers/V{Version}/{EntityName}Controller.cs
```

**Examples:**
- `IMAGEN/ptv2/PT/Controllers/PTController.cs`

### Controller Class Declaration
```csharp
namespace IMG.CLB.PT.Controllers.V{Version};

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
// ... other using statements

[Route("api/v{version}/{entity-name}")]
[ApiController]
[Authorize]
public class {EntityName}Controller(IEntityService entityService, ILogger<{EntityName}Controller> logger)
    : PtControllerBase(entityService, logger)
{
    // Controller methods
}
```

## 🛣️ Route Conventions

### Base Route Pattern
```csharp
[Route("api/v{version}/{entity-name}")]
```

**Examples:**
- `[Route("api/v3/pt")]`

### Route Naming
- Use kebab-case for multi-word entities
- Use plural nouns for collections
- Be consistent with existing patterns

## 🏗️ Controller Architecture

### Base Controller
All controllers must inherit from `PtControllerBase`:
```csharp
public class {EntityName}Controller(IEntityService entityService, ILogger<{EntityName}Controller> logger)
    : PtControllerBase(entityService, logger)
```

### Constructor Pattern
- Use primary constructor syntax
- Inject `IEntityService` and `ILogger<T>`
- Specify the appropriate module constant

## 📝 HTTP Method Conventions

### GET Endpoints

#### Get All (with filtering/pagination)
```csharp
/// <summary>
/// Gets all {EntityName}s with filtering, sorting, and pagination.
/// </summary>
/// <param name="sieveModel">Query parameters for filtering, sorting, and pagination.</param>
/// <param name="cancellationToken">Cancellation token.</param>
/// <returns>Paged result of {EntityName}s.</returns>
[HttpGet]
[ProducesResponseType(typeof(Get{EntityName}ResultDto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> GetAllAsync([FromQuery] SieveModel sieveModel, CancellationToken cancellationToken = default)
{
    return await ExecuteAsync(new GetAll{EntityName}sQuery(sieveModel), cancellationToken: cancellationToken);
}
```

#### Get All (simple list)
```csharp
[HttpGet]
[ProducesResponseType(typeof(IEnumerable<{EntityName}Dto>), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> GetAllAsync(CancellationToken cancellationToken = default)
{
    return await ExecuteAsync(new GetAll{EntityName}sQuery(), cancellationToken: cancellationToken);
}
```

#### Get By ID
```csharp
/// <summary>
/// Gets a single {EntityName} by ID.
/// </summary>
/// <param name="id">The ID of the {EntityName}.</param>
/// <param name="cancellationToken">Cancellation token.</param>
/// <returns>The {EntityName}.</returns>
[HttpGet("{id:int}")]
[ProducesResponseType(typeof({EntityName}Dto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> GetByIdAsync(int id, CancellationToken cancellationToken = default)
{
    return await ExecuteAsync(new Get{EntityName}ByIdQuery(id), cancellationToken: cancellationToken);
}
```

### POST Endpoints

#### Create Entity
```csharp
/// <summary>
/// Creates a new {EntityName}.
/// </summary>
/// <param name="{entityName}Input">The {EntityName} input data.</param>
/// <param name="cancellationToken">Cancellation token.</param>
/// <returns>The created {EntityName}.</returns>
[HttpPost]
[ProducesResponseType(typeof({EntityName}Dto), StatusCodes.Status201Created)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> CreateAsync([FromBody] Create{EntityName}Input {entityName}Input, CancellationToken cancellationToken = default)
{
    return await ExecuteAsync<{EntityName}Dto>(new Create{EntityName}Command({entityName}Input), PermissionType.Write, System.Net.HttpStatusCode.Created, cancellationToken: cancellationToken);
}
```

### PUT Endpoints

#### Update Entity
```csharp
/// <summary>
/// Updates an existing {EntityName}.
/// </summary>
/// <param name="id">The ID of the {EntityName} to update.</param>
/// <param name="{entityName}Input">The updated {EntityName} input data.</param>
/// <param name="cancellationToken">Cancellation token.</param>
/// <returns>The updated {EntityName}.</returns>
[HttpPut("{id:int}")]
[ProducesResponseType(typeof({EntityName}Dto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> UpdateAsync(int id, [FromBody] Update{EntityName}Input {entityName}Input, CancellationToken cancellationToken = default)
{
    return await ExecuteAsync<{EntityName}Dto>(new Update{EntityName}Command({entityName}Input, id), PermissionType.Write, cancellationToken: cancellationToken);
}
```

### DELETE Endpoints

#### Delete Entity
```csharp
/// <summary>
/// Deletes a {EntityName}.
/// </summary>
/// <param name="id">The ID of the {EntityName} to delete.</param>
/// <param name="cancellationToken">Cancellation token.</param>
/// <returns>Success status.</returns>
[HttpDelete("{id:int}")]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> DeleteAsync(int id, CancellationToken cancellationToken = default)
{
    return await ExecuteAsync(new Delete{EntityName}Command(id), PermissionType.Delete, cancellationToken: cancellationToken);
}
```

### Custom Action Endpoints

#### Action on Entity
```csharp
/// <summary>
/// Performs a specific action on a {EntityName}.
/// </summary>
/// <param name="id">The ID of the {EntityName}.</param>
/// <param name="cancellationToken">Cancellation token.</param>
/// <returns>The updated {EntityName}.</returns>
[HttpPost("{id:int}/{action}")]
[ProducesResponseType(typeof({EntityName}Dto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> {Action}Async(int id, CancellationToken cancellationToken = default)
{
    return await ExecuteAsync<{EntityName}Dto>(new {Action}{EntityName}Command(id), PermissionType.Write, cancellationToken: cancellationToken);
}
```

## 🔗 Nested Resource Endpoints

### Nested Resource Pattern
```csharp
/// <summary>
/// Gets a specific nested resource.
/// </summary>
/// <param name="parentId">The ID of the parent entity.</param>
/// <param name="resourceId">The ID of the nested resource.</param>
/// <param name="cancellationToken">Cancellation token.</param>
/// <returns>The nested resource.</returns>
[HttpGet("{parent-id:int}/{resource-name}/{resource-id:int}")]
[ProducesResponseType(typeof({ResourceName}Dto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> Get{ResourceName}ById(
    [FromRoute(Name = "parent-id")] int parentId, 
    [FromRoute(Name = "resource-id")] int resourceId,
    CancellationToken cancellationToken = default)
{
    return await ExecuteAsync<{ResourceName}Dto>(new Get{ResourceName}Query(parentId, resourceId), cancellationToken: cancellationToken);
}
```

## 📋 Response Type Conventions

### Standard Response Types
- **200 OK**: Successful GET, PUT operations
- **201 Created**: Successful POST operations
- **400 Bad Request**: Invalid input, validation errors
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

### ProducesResponseType Attributes
Always include comprehensive `ProducesResponseType` attributes:
```csharp
[ProducesResponseType(typeof({EntityName}Dto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
```

## 🔐 Security and Authorization

### Authorization Attributes
```csharp
[Authorize]
[ApiController]
```

### Permission Types
- `PermissionType.Read` - For GET operations
- `PermissionType.Write` - For POST, PUT operations
- `PermissionType.Delete` - For DELETE operations

### Access Validation
Controllers inherit from `PtControllerBase` which handles:
- Module access validation
- Permission checking
- Error handling

## 📝 Documentation Conventions

### XML Documentation
Every endpoint must have comprehensive XML documentation:
```csharp
/// <summary>
/// Brief description of what the endpoint does.
/// </summary>
/// <param name="paramName">Description of the parameter.</param>
/// <param name="cancellationToken">Cancellation token.</param>
/// <returns>Description of the return value.</returns>
```

### Parameter Documentation
- Document all parameters with meaningful descriptions
- Include parameter constraints and validation rules
- Explain the purpose of each parameter

## 🎯 Method Naming Conventions

### Standard Method Names
- `GetAllAsync` - For getting all entities
- `GetByIdAsync` - For getting a single entity by ID
- `CreateAsync` - For creating new entities
- `UpdateAsync` - For updating existing entities
- `DeleteAsync` - For deleting entities
- `{Action}Async` - For custom actions (e.g., `CancelAsync`, `ActivateAsync`)

### Async Pattern
- All methods must be async
- Use `CancellationToken cancellationToken = default` parameter
- Return `Task<IActionResult>`

## 🔄 ExecuteAsync Pattern

### Standard ExecuteAsync Usage
```csharp
// For queries (GET operations)
return await ExecuteAsync(new Get{EntityName}Query(parameters), cancellationToken: cancellationToken);

// For commands with return value (POST, PUT operations)
return await ExecuteAsync<{EntityName}Dto>(new {Action}{EntityName}Command(parameters), PermissionType.Write, System.Net.HttpStatusCode.Created, cancellationToken: cancellationToken);

// For commands without return value (DELETE operations)
return await ExecuteAsync(new Delete{EntityName}Command(id), PermissionType.Delete, cancellationToken: cancellationToken);
```

### ExecuteAsync Overloads
- `ExecuteAsync(IRequest<IResult> query, ...)` - For operations without return value
- `ExecuteAsync<T>(IRequest<IResult<T>> query, ...)` - For operations with return value
- `ExecuteAsync<T>(IRequest<IResult<T>> query, PermissionType, HttpStatusCode, ...)` - For operations with custom status codes

## 📚 Input/Output Conventions

### Input DTOs
- Use `{EntityName}InputDto` for input data
- Use `Create{EntityName}Input` for creation
- Use `Update{EntityName}Input` for updates
- Use `[FromBody]` attribute for complex objects
- Use `[FromQuery]` for query parameters
- Use `[FromRoute]` for route parameters

### Output DTOs
- Use `{EntityName}Dto` for single entity responses
- Use `IEnumerable<{EntityName}Dto>` for collections
- Use `PagedResult<{EntityName}Dto>` for paginated results
- Use `Get{EntityName}ResultDto` for complex query results

## 📖 Swagger Examples

### Overview
All REST endpoints **MUST** include `SwaggerRequestExample` and `SwaggerResponseExample` attributes to provide concrete examples in Swagger UI documentation. This ensures API consumers understand the expected request/response formats.

### Swagger Example Attributes

#### Required Attributes
- **`SwaggerRequestExample`**: Provides example request payloads for POST/PUT/PATCH endpoints
- **`SwaggerResponseExample`**: Provides example response payloads for all endpoints (especially 200 OK responses)

#### When to Use
- ✅ **ALWAYS use** for POST/PUT/PATCH endpoints with `[FromBody]` parameters
- ✅ **ALWAYS use** for GET endpoints that return complex DTOs
- ✅ **ALWAYS use** for endpoints with custom response types
- ✅ **RECOMMENDED** for GET endpoints with `[FromQuery]` parameters
- ⚠️ **Optional** for simple DELETE endpoints (no request body, simple response)

### Example Class Structure

#### File Organization
Create example classes in the following structure:
```
IMG.CLB.PT/SwaggerExamples/{ControllerName}/Requests/{RequestName}Example.cs
IMG.CLB.PT/SwaggerExamples/{ControllerName}/Responses/{ResponseName}Example.cs
```

**Examples:**
- `SwaggerExamples/CertificatesController/Requests/CreateCertificateRequestExample.cs`
- `SwaggerExamples/CertificatesController/Responses/CertificateResponseExample.cs`

#### Request Example Class Pattern
```csharp
namespace IMG.CLB.PT.SwaggerExamples.{ControllerName}.Requests;

using IMG.CLB.PT.Common.V{Version}.Input.{EntityName};
using Swashbuckle.AspNetCore.Filters;

/// <summary>
/// Example request for creating a {EntityName}.
/// </summary>
public class Create{EntityName}RequestExample : IExamplesProvider<Create{EntityName}Input>
{
    public Create{EntityName}Input GetExamples()
    {
        return new Create{EntityName}Input
        {
            Name = "Example {EntityName} Name",
            Description = "Example description",
            // ... other properties with realistic example values
        };
    }
}
```

#### Response Example Class Pattern
```csharp
namespace IMG.CLB.PT.SwaggerExamples.{ControllerName}.Responses;

using IMG.CLB.PT.COMMONS.V{Version}.Dtos.{EntityName};
using Swashbuckle.AspNetCore.Filters;

/// <summary>
/// Example response for {EntityName} operations.
/// </summary>
public class {EntityName}ResponseExample : IExamplesProvider<{EntityName}Dto>
{
    public {EntityName}Dto GetExamples()
    {
        return new {EntityName}Dto
        {
            Id = 1,
            Name = "Example {EntityName} Name",
            Description = "Example description",
            CreatedDate = DateTime.UtcNow.AddDays(-30),
            // ... other properties with realistic example values
        };
    }
}
```

#### Response Example for Collections
```csharp
namespace IMG.CLB.PT.SwaggerExamples.{ControllerName}.Responses;

using IMG.CLB.PT.COMMONS.V{Version}.Dtos.{EntityName};
using Swashbuckle.AspNetCore.Filters;

/// <summary>
/// Example response for listing {EntityName}s.
/// </summary>
public class {EntityName}ListResponseExample : IExamplesProvider<IEnumerable<{EntityName}Dto>>
{
    public IEnumerable<{EntityName}Dto> GetExamples()
    {
        return new List<{EntityName}Dto>
        {
            new {EntityName}Dto
            {
                Id = 1,
                Name = "First {EntityName}",
                // ... properties
            },
            new {EntityName}Dto
            {
                Id = 2,
                Name = "Second {EntityName}",
                // ... properties
            },
        };
    }
}
```

#### Response Example for Paged Results
```csharp
namespace IMG.CLB.PT.SwaggerExamples.{ControllerName}.Responses;

using IMG.CLB.PT.COMMONS.V{Version}.Dtos.{EntityName};
using IMG.CLB.PT.COMMONS.Results;
using Swashbuckle.AspNetCore.Filters;

/// <summary>
/// Example response for paginated {EntityName} results.
/// </summary>
public class {EntityName}PagedResponseExample : IExamplesProvider<PagedResult<{EntityName}Dto>>
{
    public PagedResult<{EntityName}Dto> GetExamples()
    {
        return new PagedResult<{EntityName}Dto>
        {
            Items = new List<{EntityName}Dto>
            {
                new {EntityName}Dto { Id = 1, Name = "First {EntityName}" },
                new {EntityName}Dto { Id = 2, Name = "Second {EntityName}" },
            },
            TotalCount = 2,
            Page = 1,
            PageSize = 10,
        };
    }
}
```

#### Query Parameter Example (SieveModel)
```csharp
namespace IMG.CLB.PT.SwaggerExamples.{ControllerName}.Requests;

using Sieve.Models;
using Swashbuckle.AspNetCore.Filters;

/// <summary>
/// Example query parameters for filtering, sorting, and pagination.
/// </summary>
public class {EntityName}QueryRequestExample : IExamplesProvider<SieveModel>
{
    public SieveModel GetExamples()
    {
        return new SieveModel
        {
            // Filtering examples
            Filters = "Name@=*example*,Status@=Active",
            
            // Sorting examples
            Sorts = "Name,-CreatedDate",
            
            // Pagination examples
            Page = 1,
            PageSize = 25,
        };
    }
}
```

### Controller Usage

#### POST Endpoint with Examples
```csharp
/// <summary>
/// Creates a new {EntityName}.
/// </summary>
/// <param name="{entityName}Input">The {EntityName} input data.</param>
/// <param name="cancellationToken">Cancellation token.</param>
/// <returns>The created {EntityName}.</returns>
[HttpPost]
[SwaggerRequestExample(typeof(Create{EntityName}Input), typeof(Create{EntityName}RequestExample))]
[SwaggerResponseExample(StatusCodes.Status201Created, typeof({EntityName}ResponseExample))]
[ProducesResponseType(typeof({EntityName}Dto), StatusCodes.Status201Created)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> CreateAsync([FromBody] Create{EntityName}Input {entityName}Input, CancellationToken cancellationToken = default)
{
    return await ExecuteAsync<{EntityName}Dto>(new Create{EntityName}Command({entityName}Input), PermissionType.Write, System.Net.HttpStatusCode.Created, cancellationToken: cancellationToken);
}
```

#### GET Endpoint with Examples
```csharp
/// <summary>
/// Gets all {EntityName}s with filtering, sorting, and pagination.
/// </summary>
/// <param name="sieveModel">Query parameters for filtering, sorting, and pagination.</param>
/// <param name="cancellationToken">Cancellation token.</param>
/// <returns>Paged result of {EntityName}s.</returns>
[HttpGet]
[SwaggerRequestExample(typeof(SieveModel), typeof({EntityName}QueryRequestExample))]
[SwaggerResponseExample(StatusCodes.Status200OK, typeof({EntityName}ListResponseExample))]
[ProducesResponseType(typeof(Get{EntityName}ResultDto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> GetAllAsync([FromQuery] SieveModel sieveModel, CancellationToken cancellationToken = default)
{
    return await ExecuteAsync(new GetAll{EntityName}sQuery(sieveModel), cancellationToken: cancellationToken);
}
```

#### Multiple Response Examples
For endpoints with multiple response scenarios, include examples for different status codes:
```csharp
[HttpPost("{id:int}/assign")]
[SwaggerRequestExample(typeof(CertificateAssignmentRequest), typeof(CertificateAssignmentRequestExample))]
[SwaggerResponseExample(StatusCodes.Status201Created, typeof(CertificateAssignmentResponseExample))]
[SwaggerResponseExample(StatusCodes.Status400BadRequest, typeof(BadRequestErrorExample))]
[SwaggerResponseExample(StatusCodes.Status404NotFound, typeof(NotFoundErrorExample))]
[ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> CreateAssignmentAsync(int id, [FromForm] CertificateAssignmentRequest assignmentRequest, CancellationToken cancellationToken = default)
{
    // ... implementation
}
```

### Example Best Practices

#### 1. Realistic Data
- Use realistic example values that reflect actual usage
- Include all required properties
- Show optional properties with typical values
- Use appropriate data types (dates, numbers, strings)

#### 2. Multiple Examples (When Needed)
- You can provide multiple examples for the same request type
- Use descriptive names to distinguish them (e.g., `BasicRequestExample`, `AdvancedRequestExample`)

```csharp
[SwaggerRequestExample(typeof(SieveModel), typeof(GpsLocationsRequestExample))]
[SwaggerRequestExample(typeof(SieveModel), typeof(GpsLocationsAdvancedRequestExample))]
```

#### 3. Error Response Examples
- Include examples for error responses (400, 404, 500) when appropriate
- Use `IExamplesProvider<Error>` or your error DTO type

#### 4. Namespace Organization
- Keep examples organized by controller
- Use `Requests` and `Responses` subdirectories
- Follow consistent naming: `{EntityName}RequestExample`, `{EntityName}ResponseExample`

### Common Patterns

#### Simple Entity Example
```csharp
public class CertificateResponseExample : IExamplesProvider<CertificateDto>
{
    public CertificateDto GetExamples()
    {
        return new CertificateDto
        {
            Id = 1,
            Name = "Commercial Driver's License",
            Description = "CDL for operating commercial vehicles",
            ExpirationDate = DateTime.UtcNow.AddYears(2),
            IsActive = true,
        };
    }
}
```

#### Complex Nested Object Example
```csharp
public class PtResponseExample : IExamplesProvider<PtDto>
{
    public PtDto GetExamples()
    {
        return new PtDto
        {
            Id = 100,
            Name = "Highway Construction Project",
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddMonths(6),
            Status = "Active",
            Type = new PtTypeDto
            {
                Id = 5,
                Name = "Construction",
                Class = new PtClassDto
                {
                    Id = 2,
                    Name = "Infrastructure",
                },
            },
            CustomFields = new List<PtustomFieldDto>
            {
                new PtCustomFieldDto { Id = 1, Name = "Project Code", Value = "HW-2024-001" },
            },
        };
    }
}
```

### Anti-Patterns to Avoid

#### ❌ Don't Do This:
- Missing `SwaggerRequestExample` for POST/PUT endpoints
- Missing `SwaggerResponseExample` for GET endpoints
- Using unrealistic placeholder data
- Not including all required properties in examples
- Creating examples in wrong namespace structure
- Forgetting to import `Swashbuckle.AspNetCore.Filters`

#### ✅ Do This:
- Always include both request and response examples
- Use realistic, representative data
- Include all required properties
- Follow the namespace structure
- Import necessary using statements
- Provide multiple examples when it helps clarify usage

## 📊 ResultDto Auto-Creation Patterns

### ResultDto Structure
ResultDto classes are automatically created for complex query results that include pagination, filtering, and aggregation data.

### Standard ResultDto Pattern
```csharp
namespace IMG.CLB.PT.Common.V{Version}.Dtos.{EntityName};

public record Get{EntityName}ResultDto()
{
    public Get{EntityName}ResultDto(IEnumerable<{EntityName}Dto>? {entityName}Dtos, int totalCount)
        : this()
    {
        {EntityName}Dtos = {entityName}Dtos ?? Enumerable.Empty<{EntityName}Dto>();
        TotalCount = totalCount;
    }

    public IEnumerable<{EntityName}Dto>? {EntityName}Dtos { get; set; } = Enumerable.Empty<{EntityName}Dto>();

    public int TotalCount { get; set; } = 0;
}
```

### ResultDto Conventions

#### Class Declaration
- Use `record` type for immutability
- Use `Get{EntityName}ResultDto` naming convention
- Place in the same directory as the main DTO

#### Constructor Pattern
- **Primary constructor**: Parameterless constructor
- **Secondary constructor**: With data parameters
- **Null safety**: Use `?? Enumerable.Empty<T>()` for null collections
- **Default values**: Initialize with appropriate defaults

#### Property Conventions
- **Collection property**: `IEnumerable<{EntityName}Dto>? {EntityName}Dtos`
- **Count property**: `int TotalCount`
- **Nullable collections**: Use `?` for nullable collections
- **Default initialization**: Use `Enumerable.Empty<T>()` for collections

### ResultDto Examples

#### Basic ResultDto
```csharp
namespace IMG.CLB.PT.Common.V3.Dtos.Pt;

public record GetPtResultDto()
{
    public GetPtResultDto(IEnumerable<PtDto>? ptDto, int totalCount)
        : this()
    {
        ptDtos = ptDto ?? Enumerable.Empty<PtDto>();
        TotalCount = totalCount;
    }

    public IEnumerable<PtDto>? PtDtos { get; set; } = Enumerable.Empty<PtsDto>();

    public int TotalCount { get; set; } = 0;
}
```

#### Resource Group ResultDto
```csharp
namespace IMG.CLB.PT.Common.V3.Dtos.PtResourceGroup;

public record GetPtResourceGroupResultDto()
{
    public GetPtResourceGroupResultDto(IEnumerable<PtResourceGroupDto> resourceGroupDtos, int totalCount)
        : this()
    {
        ResourceGroupDtos = resourceGroupDtos;
        TotalCount = totalCount;
    }

    public IEnumerable<PtResourceGroupDto> ResourceGroupDtos { get; set; } = [];

    public int TotalCount { get; set; } = 0;
}
```

### When to Create ResultDto

#### Create ResultDto for:
- ✅ **Paginated results** with filtering and sorting
- ✅ **Complex queries** that return multiple related entities
- ✅ **Aggregated data** with counts and totals
- ✅ **Search results** with metadata
- ✅ **List operations** that need additional context

#### Don't Create ResultDto for:
- ❌ **Simple single entity** responses
- ❌ **Basic CRUD operations** without pagination
- ❌ **Simple collections** without metadata
- ❌ **Single property** responses

### ResultDto Usage in Controllers

#### Controller Method with ResultDto
```csharp
/// <summary>
/// Gets all {EntityName}s with filtering, sorting, and pagination.
/// </summary>
/// <param name="sieveModel">Query parameters for filtering, sorting, and pagination.</param>
/// <param name="cancellationToken">Cancellation token.</param>
/// <returns>Paged result of {EntityName}s.</returns>
[HttpGet]
[ProducesResponseType(typeof(Get{EntityName}ResultDto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> GetAllAsync([FromQuery] SieveModel sieveModel, CancellationToken cancellationToken = default)
{
    return await ExecuteAsync(new GetAll{EntityName}sQuery(sieveModel), cancellationToken: cancellationToken);
}
```

### ResultDto Naming Conventions

#### File Naming
- **File name**: `Get{EntityName}ResultDto.cs`
- **Location**: Same directory as the main DTO
- **Namespace**: `IMG.CLB.PT.COMMONS.V{Version}.Dtos.{EntityName}`

#### Class Naming
- **Class name**: `Get{EntityName}ResultDto`
- **Properties**: `{EntityName}Dtos` (plural)
- **Count property**: `TotalCount`

#### Constructor Naming
- **Primary constructor**: Parameterless
- **Secondary constructor**: With data parameters
- **Parameter names**: Match property names (camelCase)

### ResultDto Best Practices

#### 1. Immutability
- Use `record` type for immutability
- Use `init` accessors when appropriate
- Provide constructor for initialization

#### 2. Null Safety
- Handle null collections gracefully
- Use `?? Enumerable.Empty<T>()` for null safety
- Initialize with appropriate defaults

#### 3. Consistency
- Follow the established pattern consistently
- Use the same naming conventions
- Maintain the same structure across all ResultDtos

#### 4. Documentation
- Add XML documentation for complex ResultDtos
- Document the purpose and usage
- Include examples when helpful

### ResultDto Anti-Patterns

#### Avoid These Patterns:
- ❌ Using `class` instead of `record`
- ❌ Not handling null collections
- ❌ Inconsistent naming conventions
- ❌ Missing default values
- ❌ Not following the established pattern

#### Correct Patterns:
- ✅ Use `record` type consistently
- ✅ Handle null collections with `?? Enumerable.Empty<T>()`
- ✅ Follow consistent naming conventions
- ✅ Provide appropriate default values
- ✅ Use the established constructor pattern

## 🚫 Common Anti-Patterns

### Avoid These Patterns:
- ❌ Missing `[Authorize]` attribute
- ❌ Missing `[ApiController]` attribute
- ❌ Missing `ProducesResponseType` attributes
- ❌ Missing `SwaggerRequestExample` and `SwaggerResponseExample` attributes
- ❌ Not inheriting from `PtControllerBase`
- ❌ Missing XML documentation
- ❌ Not using async/await pattern
- ❌ Missing cancellation token support
- ❌ Inconsistent naming conventions
- ❌ Missing error handling

### Correct Patterns:
- ✅ Always inherit from `PtControllerBase`
- ✅ Include comprehensive `ProducesResponseType` attributes
- ✅ Include `SwaggerRequestExample` for POST/PUT/PATCH endpoints
- ✅ Include `SwaggerResponseExample` for all endpoints returning DTOs
- ✅ Use proper HTTP methods for operations
- ✅ Include XML documentation for all endpoints
- ✅ Use async/await pattern consistently
- ✅ Support cancellation tokens
- ✅ Follow consistent naming conventions
- ✅ Use proper permission types

## 📚 Complete Example

### Full Controller Example
```csharp
namespace IMG.CLB.PT.Controllers.V3;

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using IMG.CLB.PT.COMMONS.Constants;
using IMG.CLB.PT.COMMONS.Enums;
using IMG.CLB.PT.COMMONS.V3.Commands.{EntityName};
using IMG.CLB.PT.COMMONS.V3.Dtos.{EntityName};
using IMG.CLB.PT.COMMONS.V3.Input.{EntityName};
using IMG.CLB.PT.COMMONS.V3.Queries.{EntityName};
using IMG.CLB.PT.SwaggerExamples.{EntityName}Controller.Requests;
using IMG.CLB.PT.SwaggerExamples.{EntityName}Controller.Responses;
using Sieve.Models;
using Swashbuckle.AspNetCore.Filters;

[Route("api/v3/{entity-name}")]
[ApiController]
[Authorize]
public class {EntityName}Controller(IMediator mediator, ILogger<{EntityName}Controller> logger)
    : PtControllerBase(mediator, logger, AccessValidationConstants.{Module}Module)
{
    /// <summary>
    /// Gets all {EntityName}s with filtering, sorting, and pagination.
    /// </summary>
    /// <param name="sieveModel">Query parameters for filtering, sorting, and pagination.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Paged result of {EntityName}s.</returns>
    [HttpGet]
    [SwaggerRequestExample(typeof(SieveModel), typeof({EntityName}QueryRequestExample))]
    [SwaggerResponseExample(StatusCodes.Status200OK, typeof({EntityName}ListResponseExample))]
    [ProducesResponseType(typeof(Get{EntityName}ResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllAsync([FromQuery] SieveModel sieveModel, CancellationToken cancellationToken = default)
    {
        return await ExecuteAsync(new GetAll{EntityName}sQuery(sieveModel), cancellationToken: cancellationToken);
    }

    /// <summary>
    /// Gets a single {EntityName} by ID.
    /// </summary>
    /// <param name="id">The ID of the {EntityName}.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The {EntityName}.</returns>
    [HttpGet("{id:int}")]
    [SwaggerResponseExample(StatusCodes.Status200OK, typeof({EntityName}ResponseExample))]
    [ProducesResponseType(typeof({EntityName}Dto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await ExecuteAsync(new Get{EntityName}ByIdQuery(id), cancellationToken: cancellationToken);
    }

    /// <summary>
    /// Creates a new {EntityName}.
    /// </summary>
    /// <param name="{entityName}Input">The {EntityName} input data.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The created {EntityName}.</returns>
    [HttpPost]
    [SwaggerRequestExample(typeof(Create{EntityName}Input), typeof(Create{EntityName}RequestExample))]
    [SwaggerResponseExample(StatusCodes.Status201Created, typeof({EntityName}ResponseExample))]
    [ProducesResponseType(typeof({EntityName}Dto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateAsync([FromBody] Create{EntityName}Input {entityName}Input, CancellationToken cancellationToken = default)
    {
        return await ExecuteAsync<{EntityName}Dto>(new Create{EntityName}Command({entityName}Input), PermissionType.Write, System.Net.HttpStatusCode.Created, cancellationToken: cancellationToken);
    }

    /// <summary>
    /// Updates an existing {EntityName}.
    /// </summary>
    /// <param name="id">The ID of the {EntityName} to update.</param>
    /// <param name="{entityName}Input">The updated {EntityName} input data.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The updated {EntityName}.</returns>
    [HttpPut("{id:int}")]
    [SwaggerRequestExample(typeof(Update{EntityName}Input), typeof(Update{EntityName}RequestExample))]
    [SwaggerResponseExample(StatusCodes.Status200OK, typeof({EntityName}ResponseExample))]
    [ProducesResponseType(typeof({EntityName}Dto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] Update{EntityName}Input {entityName}Input, CancellationToken cancellationToken = default)
    {
        return await ExecuteAsync<{EntityName}Dto>(new Update{EntityName}Command({entityName}Input, id), PermissionType.Write, cancellationToken: cancellationToken);
    }

    /// <summary>
    /// Deletes a {EntityName}.
    /// </summary>
    /// <param name="id">The ID of the {EntityName} to delete.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Success status.</returns>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        return await ExecuteAsync(new Delete{EntityName}Command(id), PermissionType.Delete, cancellationToken: cancellationToken);
    }
}
```

## 🧪 Automated Sieve Testing

### Overview
All GET endpoints that accept `SieveModel` **MUST** include automated tests for filtering, sorting, and pagination functionality. This ensures Sieve integration works correctly for every endpoint.

### Test Requirements

#### Minimum Test Coverage
Every GET endpoint with SieveModel should have tests for:
1. ✅ **Filtering** - Verify filters are applied correctly
2. ✅ **Sorting** - Verify ascending and descending sorts work
3. ✅ **Pagination** - Verify page and page size work correctly
4. ✅ **Combined Operations** - Verify filtering + sorting + pagination together
5. ✅ **Null/Empty SieveModel** - Verify endpoint handles null/empty SieveModel gracefully

### Test Patterns

#### Controller Test Pattern
```csharp
namespace IMG.CLB.PT.Tests.Controllers.V3;

using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using IMG.CLB.PT.Common.Results;
using IMG.CLB.PT.Common.V3.Dtos.{EntityName};
using IMG.CLB.PT.Common.V3.Queries.{EntityName};
using IMG.CLB.PT.Controllers.V3;
using Sieve.Models;
using Xunit;

public class {EntityName}ControllerTests
{
    private readonly Mock<IMediator> _mediatorMock;
    private readonly Mock<ILogger<{EntityName}Controller>> _loggerMock;
    private readonly {EntityName}Controller _controller;

    public {EntityName}ControllerTests()
    {
        _mediatorMock = new Mock<IMediator>();
        _loggerMock = new Mock<ILogger<{EntityName}Controller>>();
        _controller = new {EntityName}Controller(_mediatorMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task GetAllAsync_WithValidSieveModel_ReturnsOkResult()
    {
        // Arrange
        var sieveModel = new SieveModel
        {
            Page = 1,
            PageSize = 10,
            Filters = "Name@=*test*",
            Sorts = "Name",
        };

        var result = Result<Get{EntityName}ResultDto>.Success(new Get{EntityName}ResultDto
        {
            {EntityName}Dtos = Array.Empty<{EntityName}Dto>(),
            TotalCount = 0,
        });

        _mediatorMock
            .Setup(m => m.Send(It.IsAny<GetAll{EntityName}sQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetAllAsync(sieveModel, CancellationToken.None);

        // Assert
        response.Should().BeOfType<OkObjectResult>();
        
        _mediatorMock.Verify(
            m => m.Send(
                It.Is<GetAll{EntityName}sQuery>(q => q.SieveModel == sieveModel),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Theory]
    [InlineData("Name@=*test*", "Name", 1, 10)]
    [InlineData("Status@=Active", "-CreatedDate", 2, 20)]
    [InlineData(null, "Id", 1, 25)]
    public async Task GetAllAsync_WithVariousSieveModels_ReturnsOkResult(
        string? filters, string? sorts, int page, int pageSize)
    {
        // Arrange
        var sieveModel = new SieveModel
        {
            Filters = filters,
            Sorts = sorts,
            Page = page,
            PageSize = pageSize,
        };

        var result = Result<Get{EntityName}ResultDto>.Success(new Get{EntityName}ResultDto
        {
            {EntityName}Dtos = Array.Empty<{EntityName}Dto>(),
            TotalCount = 0,
        });

        _mediatorMock
            .Setup(m => m.Send(It.IsAny<GetAll{EntityName}sQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetAllAsync(sieveModel, CancellationToken.None);

        // Assert
        response.Should().BeOfType<OkObjectResult>();
        
        _mediatorMock.Verify(
            m => m.Send(
                It.Is<GetAll{EntityName}sQuery>(q => 
                    q.SieveModel!.Filters == filters &&
                    q.SieveModel.Sorts == sorts &&
                    q.SieveModel.Page == page &&
                    q.SieveModel.PageSize == pageSize),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task GetAllAsync_WithNullSieveModel_ReturnsOkResult()
    {
        // Arrange
        var result = Result<Get{EntityName}ResultDto>.Success(new Get{EntityName}ResultDto
        {
            {EntityName}Dtos = Array.Empty<{EntityName}Dto>(),
            TotalCount = 0,
        });

        _mediatorMock
            .Setup(m => m.Send(It.IsAny<GetAll{EntityName}sQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetAllAsync(null, CancellationToken.None);

        // Assert
        response.Should().BeOfType<OkObjectResult>();
        
        _mediatorMock.Verify(
            m => m.Send(
                It.Is<GetAll{EntityName}sQuery>(q => q.SieveModel == null),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }
}
```

### Reusable Test Base Class (Optional)

For consistency across all endpoint tests, consider creating a base test class:

```csharp
namespace IMG.CLB.PT.Tests.Helpers;

using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using IMG.CLB.PT.Common.Results;
using Sieve.Models;

/// <summary>
/// Base class for testing GET endpoints with SieveModel support.
/// </summary>
/// <typeparam name="TController">The controller type being tested.</typeparam>
/// <typeparam name="TQuery">The query type used by the controller.</typeparam>
/// <typeparam name="TDto">The DTO type returned by the endpoint.</typeparam>
public abstract class SieveEndpointTestBase<TController, TQuery, TDto>
    where TController : ControllerBase
    where TQuery : IRequest<IResult<TDto>>
{
    protected Mock<IMediator> MediatorMock { get; }
    protected Mock<ILogger<TController>> LoggerMock { get; }
    protected TController Controller { get; }

    protected SieveEndpointTestBase()
    {
        MediatorMock = new Mock<IMediator>();
        LoggerMock = new Mock<ILogger<TController>>();
        Controller = CreateController();
    }

    protected abstract TController CreateController();

    protected abstract TQuery CreateQuery(SieveModel? sieveModel);

    protected abstract IActionResult InvokeGetAll(TController controller, SieveModel? sieveModel);

    [Fact]
    public async Task GetAllAsync_WithValidSieveModel_ReturnsOkResult()
    {
        // Arrange
        var sieveModel = new SieveModel
        {
            Page = 1,
            PageSize = 10,
            Filters = "Name@=*test*",
            Sorts = "Name",
        };

        var result = CreateSuccessResult();
        MediatorMock
            .Setup(m => m.Send(It.IsAny<TQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var response = InvokeGetAll(Controller, sieveModel);

        // Assert
        response.Should().BeOfType<OkObjectResult>();
        
        MediatorMock.Verify(
            m => m.Send(
                It.Is<TQuery>(q => VerifySieveModel(q, sieveModel)),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task GetAllAsync_WithNullSieveModel_ReturnsOkResult()
    {
        // Arrange
        var result = CreateSuccessResult();
        MediatorMock
            .Setup(m => m.Send(It.IsAny<TQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var response = InvokeGetAll(Controller, null);

        // Assert
        response.Should().BeOfType<OkObjectResult>();
        
        MediatorMock.Verify(
            m => m.Send(
                It.Is<TQuery>(q => VerifySieveModel(q, null)),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    protected abstract IResult<TDto> CreateSuccessResult();

    protected abstract bool VerifySieveModel(TQuery query, SieveModel? expectedSieveModel);
}
```

### Integration Test Pattern (Recommended)

For comprehensive testing, create integration tests that test Sieve with actual database queries:

```csharp
namespace IMG.CLB.PT.IntegrationTests.Controllers.V3;

using FluentAssertions;
using IMG.CLB.PT.Common.V3.Dtos.{EntityName};
using IMG.CLB.PT.IntegrationTests.Helpers;
using Sieve.Models;
using Xunit;

[Collection("IntegrationTests")]
public class {EntityName}ControllerIntegrationTests : ApplicationContextTestBase
{
    [Fact]
    public async Task GetAllAsync_WithFilter_ReturnsFilteredResults()
    {
        // Arrange - Use in-memory database with test data
        var dbContext = BuildDbContext(
            nameof(GetAllAsync_WithFilter_ReturnsFilteredResults),
            GetTestEntities());

        var sieveModel = new SieveModel
        {
            Filters = "Name@=*test*",
            Page = 1,
            PageSize = 10,
        };

        // Act - Call actual controller/query handler
        // ... implementation ...

        // Assert - Verify results are actually filtered
        // ... assertions ...
    }

    [Fact]
    public async Task GetAllAsync_WithSort_ReturnsSortedResults()
    {
        // Arrange
        var dbContext = BuildDbContext(
            nameof(GetAllAsync_WithSort_ReturnsSortedResults),
            GetTestEntities());

        var sieveModel = new SieveModel
        {
            Sorts = "-Name",
            Page = 1,
            PageSize = 10,
        };

        // Act & Assert
        // Verify results are sorted descending by Name
    }

    [Fact]
    public async Task GetAllAsync_WithPagination_ReturnsCorrectPage()
    {
        // Arrange
        var dbContext = BuildDbContext(
            nameof(GetAllAsync_WithPagination_ReturnsCorrectPage),
            GetTestEntities());

        var sieveModel = new SieveModel
        {
            Page = 2,
            PageSize = 5,
        };

        // Act & Assert
        // Verify only page 2 results are returned (items 6-10)
    }

    private IEnumerable<{EntityName}> GetTestEntities()
    {
        // Return test data
        return new List<{EntityName}>
        {
            // ... test entities ...
        };
    }
}
```

### Test Checklist

When creating tests for a new GET endpoint with SieveModel, ensure:

- [ ] Test with valid SieveModel (filters, sorts, pagination)
- [ ] Test with null SieveModel
- [ ] Test with empty SieveModel
- [ ] Test filtering works correctly
- [ ] Test sorting (ascending and descending)
- [ ] Test pagination (page and page size)
- [ ] Test combined operations (filter + sort + pagination)
- [ ] Verify SieveModel is passed correctly to repository/query handler
- [ ] Test error handling for invalid SieveModel parameters

### Best Practices

1. **Use Theory/InlineData** for testing multiple SieveModel variations
2. **Capture SieveModel** in repository mocks to verify it's passed correctly
3. **Test Edge Cases** - null, empty, invalid filters/sorts
4. **Integration Tests** - Use in-memory database for actual Sieve processing
5. **Consistent Test Data** - Use predictable test data for reliable assertions

### Anti-Patterns to Avoid

- ❌ Only testing with null/empty SieveModel
- ❌ Not verifying SieveModel is passed to repository
- ❌ Not testing filtering, sorting, and pagination separately
- ❌ Not testing combined operations
- ❌ Mocking repository responses without verifying SieveModel parameters

Remember to always follow these conventions when creating or modifying REST endpoints to maintain consistency across the project.

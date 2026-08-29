# Naming Conventions - Request/Response Pattern

## 🎯 Overview

This document defines the naming conventions for Request and Response classes in the IMG.CLB.PT project.

---

## 📝 Request Naming Convention

### Pattern
```
{Action}{Entity}Request
```

### Examples
- `GetComplexRequest` - Get single complex
- `GetComplexesRequest` - Get multiple complexes
- `GetComplexesPaginatedRequest` - Get paginated complexes
- `CreateComplexRequest` - Create new complex
- `UpdateComplexRequest` - Update existing complex
- `DeleteComplexRequest` - Delete complex
- `{CustomAction}{Entity}Request` - Custom actions

### Rules
- ✅ **Action first** - Verb describing the operation (Get, Create, Update, Delete, etc.)
- ✅ **Entity second** - The entity being operated on (Complex, Plant, Workstation, etc.)
- ✅ **Request suffix** - Always end with "Request"
- ✅ **PascalCase** - C# property names
- ✅ **camelCase** - JSON property names (via `[JsonPropertyName]`)

---

## 📤 Response Naming Convention

### Pattern

Use **generic response classes** from COMMONS when possible:

```csharp
// Generic responses (preferred)
PaginatedResponse<T>              // For paginated GET operations
InsertUpdateDeleteResponse        // For POST/PUT/PATCH/DELETE operations
{Entity}                          // The entity itself for GET operations
List<{Entity}>                    // List of entities for GET operations

// Custom responses (only when generic doesn't fit)
{Action}{Entity}Response
```

### Examples
```csharp
// Using generic responses (preferred)
Result<PaginatedResponse<List<Complex>>>      // GET paginated
Result<InsertUpdateDeleteResponse>            // POST/PUT/PATCH
Result<Complex>                               // GET one
Result<List<Complex>>                         // GET all

// Custom response (only if needed)
Result<ExportComplexResponse>                 // Custom action
```

---

## 🎨 Complete Example - Complex Entity

### Request Classes
```csharp
// Entities/Complex/GetComplexRequest.cs
public class GetComplexRequest : Request
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
}

// Entities/Complex/CreateComplexRequest.cs
public class CreateComplexRequest : Request
{
    [JsonPropertyName("nombre")]
    public string Nombre { get; set; } = string.Empty;
}

// Entities/Complex/UpdateComplexRequest.cs
public class UpdateComplexRequest : CreateComplexRequest
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
}

// Entities/Complex/GetComplexesPaginatedRequest.cs
public class GetComplexesPaginatedRequest : PaginatedRequest
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    
    [JsonPropertyName("active")]
    public bool? Active { get; set; }
}
```

### Service Interface
```csharp
public interface IComplexService
{
    Result<List<Complex>> GetComplexes(GetComplexesRequest request);
    Result<Complex?> GetComplex(GetComplexRequest request);
    Result<PaginatedResponse<List<Complex>>> GetComplexesPaginated(GetComplexesPaginatedRequest request);
    Result<InsertUpdateDeleteResponse> CreateComplex(CreateComplexRequest request);
    Result<InsertUpdateDeleteResponse> UpdateComplex(UpdateComplexRequest request);
}
```

### Controller
```csharp
[HttpGet]
public async Task<IResult> GetAllAsync([FromQuery] GetComplexesRequest request, CancellationToken cancellationToken = default)

[HttpGet("{id:int}")]
public async Task<IResult> GetByIdAsync(int id, CancellationToken cancellationToken = default)

[HttpGet("paginated")]
public async Task<IResult> GetPaginatedAsync([FromQuery] GetComplexesPaginatedRequest request, CancellationToken cancellationToken = default)

[HttpPost]
public async Task<IResult> CreateAsync([FromBody] CreateComplexRequest request, CancellationToken cancellationToken = default)

[HttpPut("{id:int}")]
public async Task<IResult> UpdateAsync(int id, [FromBody] UpdateComplexRequest request, CancellationToken cancellationToken = default)
```

---

## 🔤 Action Verbs

### Standard Actions
| Action | Purpose | HTTP Method | Example |
|--------|---------|-------------|---------|
| **Get** | Retrieve one entity | GET | `GetComplexRequest` |
| **Get{Plural}** | Retrieve multiple entities | GET | `GetComplexesRequest` |
| **Get{Plural}Paginated** | Retrieve paginated entities | GET | `GetComplexesPaginatedRequest` |
| **Create** | Create new entity | POST | `CreateComplexRequest` |
| **Update** | Update existing entity | PUT | `UpdateComplexRequest` |
| **Delete** | Delete entity | DELETE | `DeleteComplexRequest` |

### Custom Actions
| Action | Purpose | HTTP Method | Example |
|--------|---------|-------------|---------|
| **Activate** | Activate entity | PATCH | `ActivateComplexRequest` |
| **Deactivate** | Deactivate entity | PATCH | `DeactivateComplexRequest` |
| **SwitchValidity** | Toggle active status | PATCH | `SwitchValidityComplexRequest` |
| **Approve** | Approve entity | PATCH | `ApproveComplexRequest` |
| **Reject** | Reject entity | PATCH | `RejectComplexRequest` |
| **Export** | Export entity data | GET | `ExportComplexesRequest` |
| **Import** | Import entity data | POST | `ImportComplexesRequest` |

---

## 📦 File Organization

### Directory Structure
```
Entities/{EntityName}/
├── {EntityName}.cs                          ← Entity model
├── Get{EntityName}Request.cs                ← GET one
├── Get{EntityName}sRequest.cs               ← GET all
├── Get{EntityName}sPaginatedRequest.cs      ← GET paginated
├── Create{EntityName}Request.cs             ← POST create
├── Update{EntityName}Request.cs             ← PUT update
├── Delete{EntityName}Request.cs             ← DELETE (if needed)
└── {CustomAction}{EntityName}Request.cs     ← Custom actions
```

### Naming Rules
- ✅ One file per class
- ✅ File name matches class name exactly
- ✅ Organized by entity in subdirectories
- ✅ No abbreviations unless industry standard

---

## 🔄 JSON Property Naming

### Request Properties (Frontend → Backend)
```csharp
public class CreateComplexRequest : Request
{
    // C# Property: PascalCase
    // JSON Property: camelCase
    [JsonPropertyName("nombre")]
    public string Nombre { get; set; }

    [JsonPropertyName("active")]
    public bool Active { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime? CreatedAt { get; set; }
}
```

### Response Properties (Backend → Frontend)
```csharp
public class InsertUpdateDeleteResponse
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("rowsAffected")]
    public int RowsAffected { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }
}
```

---

## 🚫 Anti-Patterns

### Avoid These Patterns:

#### ❌ Request prefix instead of suffix
```csharp
// BAD
RequestGetComplex
RequestCreateComplex
RequestUpdateComplex

// GOOD
GetComplexRequest
CreateComplexRequest
UpdateComplexRequest
```

#### ❌ Using HTTP verbs instead of action verbs
```csharp
// BAD (in service methods)
PostComplex(...)
PutComplex(...)
PatchComplex(...)

// GOOD
CreateComplex(...)
UpdateComplex(...)
SwitchValidityComplex(...)
```

#### ❌ Using Input suffix
```csharp
// BAD
CreateComplexInput
UpdateComplexInput

// GOOD
CreateComplexRequest
UpdateComplexRequest
```

#### ❌ Inconsistent pluralization
```csharp
// BAD
GetComplexRequest      // For multiple
GetComplexsRequest     // Wrong plural

// GOOD
GetComplexRequest      // For single
GetComplexesRequest    // For multiple (correct plural)
```

#### ❌ Creating custom response classes when generic works
```csharp
// BAD
public class CreateComplexResponse
{
    public int Id { get; set; }
    public int RowsAffected { get; set; }
}

// GOOD - Use generic
Result<InsertUpdateDeleteResponse>
```

---

## ✅ Best Practices

### 1. Use Generic Responses
```csharp
// ✅ Prefer generic responses from COMMONS
Result<PaginatedResponse<List<Complex>>>
Result<InsertUpdateDeleteResponse>
Result<Complex>
Result<List<Complex>>

// ❌ Only create custom responses when absolutely necessary
Result<CustomComplexResponse>  // Only if generic doesn't fit
```

### 2. Inherit from Base Classes
```csharp
// ✅ Inherit from PaginatedRequest for pagination
public class GetComplexesPaginatedRequest : PaginatedRequest
{
    // Add entity-specific filters
}

// ✅ Inherit from Create for Update
public class UpdateComplexRequest : CreateComplexRequest
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
}
```

### 3. Add XML Documentation
```csharp
/// <summary>
/// Request for creating a new complex.
/// </summary>
public class CreateComplexRequest : Request
{
    /// <summary>
    /// The name of the complex.
    /// </summary>
    [JsonPropertyName("nombre")]
    public string Nombre { get; set; } = string.Empty;
}
```

### 4. Use Descriptive Action Names
```csharp
// ✅ GOOD - Clear intent
CreateComplexRequest
UpdateComplexRequest
ActivateComplexRequest
ApproveWorkPermitRequest

// ❌ BAD - Generic or unclear
ProcessComplexRequest
HandleComplexRequest
DoSomethingRequest
```

---

## 📋 Checklist for New Entities

When creating a new entity, ensure:

- [ ] Request classes follow `{Action}{Entity}Request` pattern
- [ ] Request classes end with "Request" suffix
- [ ] Use action verbs (Create, Update) not HTTP verbs (Post, Put)
- [ ] Use generic Response classes from COMMONS
- [ ] JSON properties use camelCase
- [ ] C# properties use PascalCase
- [ ] XML documentation on all classes and properties
- [ ] Inherit from base classes when applicable (PaginatedRequest, etc.)
- [ ] File names match class names exactly
- [ ] One class per file

---

## 🎯 Quick Reference

### Request Naming
```
{Action}{Entity}Request

Action: Get, Create, Update, Delete, Activate, Approve, etc.
Entity: Complex, Plant, Workstation, etc.
```

### Response Naming
```
Generic (from COMMONS):
- PaginatedResponse<T>
- InsertUpdateDeleteResponse
- {Entity} (the entity itself)
- List<{Entity}>

Custom (only when needed):
- {Action}{Entity}Response
```

### Service Methods
```csharp
// Use action verbs, not HTTP verbs
Create{Entity}(...)      // ✅ Not Post{Entity}
Update{Entity}(...)      // ✅ Not Put{Entity}
Delete{Entity}(...)      // ✅ Not Delete{Entity} (this one is ok)
Get{Entity}(...)         // ✅
```

---

**Version:** 1.0  
**Last Updated:** December 7, 2025  
**Status:** ✅ Active and Enforced


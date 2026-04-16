# Sidae.Commons

Biblioteca de clases compartida para el ecosistema Sidae. Proporciona entidades, servicios, acceso a datos y utilidades reutilizables para microservicios y aplicaciones .NET.

---

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Compilar el proyecto](#compilar-el-proyecto)
- [Usar la biblioteca en otro proyecto](#usar-la-biblioteca-en-otro-proyecto)
- [Uso e inyección de dependencias](#uso-e-inyección-de-dependencias)
- [Consideraciones de diseño](#consideraciones-de-diseño)
- [Licencia](#licencia)

---

## Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **.NET** | 10.0 | Framework base |
| **Microsoft.EntityFrameworkCore** | 10.0.5 | ORM y acceso a datos |
| **Microsoft.EntityFrameworkCore.SqlServer** | 10.0.5 | Proveedor SQL Server |
| **Microsoft.Extensions.Configuration.Abstractions** | 10.0.5 | Configuración |
| **Microsoft.Extensions.Logging** | 10.0.5 | Registro y logs |
| **Microsoft.Extensions.Options** | 10.0.5 | Opciones y configuración (DI) |
| **Swashbuckle.AspNetCore** | 10.1.5 | Documentación OpenAPI/Swagger |

---

## Requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- Visual Studio 2022, VS Code o Rider (opcional)

---

## Estructura del proyecto

```
Sidae.Commons/
├── DataAccess/          # DbContext, configuraciones EF Core
├── Dtos/                # DTOs compartidos (requests/responses)
├── Entities/            # Entidades de dominio y modelos base
├── Enums/               # Enumeraciones compartidas
├── Extensions/          # Extensiones (Result, trazas, etc.)
├── Handlers/            # Manejo global de excepciones
├── Helpers/             # Utilidades (fechas, JSON, etc.)
├── Interfaces/          # Contratos de servicios
├── Middlewares/         # Middleware de pipeline
├── Patterns/            # Result, Error y patrones comunes
├── Services/            # Implementaciones de servicios
└── Settings/            # Configuraciones (Azure, SQL, etc.)
```

La biblioteca sigue **Clean Architecture** con separación clara: Interfaces → Services, DataAccess, Entities/Dtos compartidos.

---

## Compilar el proyecto

### Línea de comandos

```bash
# Clonar (ajusta la URL a tu repositorio)
git clone <url-del-repositorio> Sidae.Commons
cd Sidae.Commons

# Restaurar dependencias
dotnet restore

# Compilar (Debug)
dotnet build

# Compilar (Release)
dotnet build -c Release
```

### Salida

El ensamblado generado es:

- **Debug:** `bin/Debug/net10.0/Sidae.Commons.dll`
- **Release:** `bin/Release/net10.0/Sidae.Commons.dll`

*(Junto con las dependencias necesarias en la misma carpeta.)*

---

## Usar la biblioteca en otro proyecto

Puedes consumir **Sidae.Commons** de dos maneras: como **referencia de proyecto** (recomendado en la misma solución) o como **referencia al .dll**.

### Opción 1: Referencia de proyecto (recomendado)

En la misma solución o en un directorio accesible:

```xml
<ItemGroup>
  <ProjectReference Include="..\Commons\Sidae.Commons.csproj" />
</ItemGroup>
```

Ventajas: siempre usas la versión compilada actual, sin copiar DLLs a mano.

### Opción 2: Referencia al .dll

Útil cuando Commons se compila por separado y se distribuye como binario.

1. **Compilar** Commons y localizar `Sidae.Commons.dll` (y sus dependencias si aplica) en `bin/Debug/net10.0` o `bin/Release/net10.0`.

2. **Copiar** el `.dll` (por ejemplo a una carpeta `Binaries` o `lib` dentro de tu proyecto consumidor).

3. **Referenciar** en el `.csproj` del proyecto que usa la biblioteca:

```xml
<ItemGroup>
  <Reference Include="Sidae.Commons">
    <HintPath>Binaries\Sidae.Commons.dll</HintPath>
  </Reference>
</ItemGroup>
```

Ajusta `HintPath` si guardas el DLL en otra ruta (por ejemplo `lib/Sidae.Commons.dll`).

4. **Dependencias transitivas:** Si tu proyecto consumidor no referencia ya los mismos paquetes (EF Core, Microsoft.Graph, etc.), puede que debas añadir esas referencias de paquete en el `.csproj` del consumidor. Con **ProjectReference** esto se resuelve automáticamente.

---

## Uso e inyección de dependencias

Tras referenciar la biblioteca (proyecto o DLL), registra sus servicios en el contenedor de DI (por ejemplo en `Program.cs`).

### Ejemplo: registro de servicios

```csharp
// Program.cs
using Sidae.Commons.Services;
using Sidae.Commons.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Person
builder.Services.AddScoped<IPersonService, PersonService>();

// ClinicalHistory
builder.Services.AddScoped<IClinicalHistoryService, ClinicalHistoryService>();
builder.Services.AddScoped<IPacientStatusService, PacientStatusService>();
builder.Services.AddScoped<IDiagnosticService, DiagnosticService>();
builder.Services.AddScoped<IAntecedentService, AntecedentService>();
builder.Services.AddScoped<IConclusionService, ConclusionService>();
builder.Services.AddScoped<IObservationService, ObservationService>();
builder.Services.AddScoped<IReasonService, ReasonService>();
builder.Services.AddScoped<IClinicalHistoryReligionService, ClinicalHistoryReligionService>();
builder.Services.AddScoped<IClinicalHistoryMaritalStatusService, ClinicalHistoryMaritalStatusService>();
builder.Services.AddScoped<IClinicalHistoryOccupationService, ClinicalHistoryOccupationService>();

// General (Religion, MaritalStatus, Occupation)
builder.Services.AddScoped<IReligionService, ReligionService>();
builder.Services.AddScoped<IMaritalStatusService, MaritalStatusService>();
builder.Services.AddScoped<IOccupationService, OccupationService>();

// Security
builder.Services.AddScoped<ISecurityActionService, SecurityActionService>();
builder.Services.AddScoped<IEndpointService, EndpointService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IPermissionService, PermissionService>();
builder.Services.AddScoped<IRoleUserService, RoleUserService>();

// DbContext y otros servicios que exponga Commons
// builder.Services.AddDbContext<AppDbContext>(...);

var app = builder.Build();
// ...
```

### Ejemplo: uso en un controlador

```csharp
[ApiController]
[Route("api/[controller]")]
public class PersonsController : ControllerBase
{
    private readonly IPersonService _personService;

    public PersonsController(IPersonService personService)
    {
        _personService = personService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var result = await _personService.GetByIdAsync(id, ct);
        return result.Match(
            onSuccess: Ok,
            onFailure: err => StatusCode((int)err.StatusCode, err)
        );
    }
}
```

Ajusta nombres de interfaces/servicios y rutas a los que realmente exponga Sidae.Commons.

---

## Consideraciones de diseño

- **Compartido vs específico:** En Commons solo debe ir lógica y datos **compartidos** entre varios proyectos (entidades base, servicios de datos comunes, integraciones globales). La lógica propia de un microservicio debe vivir en ese microservicio.
- **Result / errores:** Se usa el patrón `Result<T>` y manejo de errores unificado; conviene seguir el mismo patrón en los consumidores.
- **Migraciones:** Las migraciones de EF Core se gestionan desde el proyecto que tenga el DbContext en uso (por ejemplo, el API o un proyecto de persistencia), no necesariamente desde Commons si solo se reparte como DLL.

---

## Licencia

Este proyecto está bajo la licencia MIT.

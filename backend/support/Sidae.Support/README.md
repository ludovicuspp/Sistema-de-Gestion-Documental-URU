# Sidae.Support

API REST del ecosistema Sidae. Expone endpoints protegidos con JWT y Azure AD, utiliza **Sidae.Commons** para entidades, servicios y acceso a datos compartidos.

---

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Compilar y ejecutar el proyecto](#compilar-y-ejecutar-el-proyecto)
- [Dependencia de Sidae.Commons](#dependencia-de-sidaecommons)
- [Configuración](#configuración)
- [Consideraciones](#consideraciones)
- [Licencia](#licencia)

---

## Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **.NET** | 10.0 | Framework base |
| **Microsoft.AspNetCore.Authentication.JwtBearer** | 9.0.0 | Autenticación JWT |
| **Microsoft.Identity.Web** | 4.0.1 | Integración con Azure AD |
| **Microsoft.EntityFrameworkCore** | 10.0.5 | ORM (alineado con Sidae.Commons) |
| **Microsoft.EntityFrameworkCore.SqlServer** | 10.0.5 | Proveedor SQL Server |
| **Microsoft.Extensions.Diagnostics.HealthChecks** | 8.0.8 | Comprobaciones de salud |
| **Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore** | 10.0.5 | Health check de base de datos |
| **Swashbuckle.AspNetCore** | 6.4.0 | Documentación OpenAPI/Swagger |
| **Azure.Extensions.AspNetCore.Configuration.Secrets** | 1.3.2 | Configuración desde Azure Key Vault |
| **Microsoft.ApplicationInsights.AspNetCore** | 2.23.0 | Telemetría y monitorización |

---

## Requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- **Sidae.Commons** compilado y referenciado (ver sección siguiente)
- SQL Server (o la instancia que use la cadena de conexión)
- Visual Studio 2022, VS Code o Rider (opcional)

---

## Estructura del proyecto

```
Sidae.Support/
├── Controllers/       # Controladores API (Person, etc.)
├── Interfaces/       # Contratos de servicios propios del Backend (si aplica)
├── Services/         # Implementaciones de servicios propios (si aplica)
├── Properties/       # launchSettings.json y configuración de ejecución
├── Program.cs        # Configuración de la aplicación, DI, middleware
├── appsettings.json  # Configuración base
└── appsettings.Development.json
```

La lógica de negocio y datos compartidos (Person, AppDbContext, IPersonService, etc.) reside en **Sidae.Commons**; el Backend la consume y expone vía REST.

---

## Compilar y ejecutar el proyecto

### Línea de comandos

```bash
# Clonar (ajusta la URL a tu repositorio)
git clone <url-del-repositorio> Sidae.Support
cd Sidae.Support

# Restaurar dependencias
dotnet restore

# Compilar (Debug)
dotnet build

# Compilar (Release)
dotnet build -c Release

# Ejecutar (Development)
dotnet run

# Ejecutar con perfil específico
dotnet run --launch-profile "https"
```

### Salida

- **Debug:** `bin/Debug/net10.0/Sidae.Support.dll`
- **Release:** `bin/Release/net10.0/Sidae.Support.dll`

Por defecto la API escucha en las URLs definidas en `Properties/launchSettings.json`. En desarrollo, Swagger suele estar disponible en `/swagger`.

---

## Dependencia de Sidae.Commons

El Backend usa la biblioteca **Sidae.Commons** (entidades, DbContext, servicios como `IPersonService`). Las versiones de **Entity Framework Core** deben coincidir (en ambos proyectos se usa 10.0.5).

### Referencia de proyecto (configuración actual)

Desde `Sidae.Support/Sidae.Support.csproj`, la ruta relativa al proyecto compartido es:

```xml
<ItemGroup>
  <ProjectReference Include="..\..\Sidae.Commons\Sidae.Commons.csproj" />
</ItemGroup>
```

Estructura esperada en disco: `backend/Sidae.Commons/` y `backend/support/Sidae.Support/` (hermanos bajo `backend/`).

### Alternativa: referencia solo al .dll

1. **Compilar** **Sidae.Commons** y localizar `Sidae.Commons.dll` en `bin/Debug/net10.0` o `bin/Release/net10.0`.

2. **Copiar** el `.dll` a una carpeta accesible por el Backend (por ejemplo `Binaries` en la raíz del Backend o en una ruta compartida como `..\SUPPORT\Binaries`).

3. **Referenciar** en `Sidae.Support.csproj`:

```xml
<ItemGroup>
  <Reference Include="Sidae.Commons">
    <HintPath>Binaries\Sidae.Commons.dll</HintPath>
  </Reference>
</ItemGroup>
```

Ajusta `HintPath` según dónde copies el DLL (por ejemplo `..\SUPPORT\Binaries\Sidae.Commons.dll`).

4. En **Program.cs** se registran el `AppDbContext` y los servicios de **Sidae.Commons** (por ejemplo `IPersonService` → `PersonService`). No es necesario cambiar nada si ya están registrados.

---

## Configuración

La aplicación usa `appsettings.json`, `appsettings.Development.json` y, en entornos que lo soporten, **Azure Key Vault** (configurable en `Program.cs`).

### Ejemplo de configuración local (User Secrets o `appsettings.Development.json`)

```json
{
  "SQLServer": {
    "ConnectionString": "Server=.;Database=Sidae;Trusted_Connection=True;Encrypt=False;"
  },
  "Azure": {
    "Instance": "https://login.microsoftonline.com/",
    "TenantId": "<tenant-id>",
    "ClientId": "<client-id>",
    "ClientSecret": "<client-secret>",
    "Domain": "<dominio>.onmicrosoft.com"
  },
  "KeyVault": {
    "Name": "<nombre-del-key-vault>"
  }
}
```

### Parámetros principales

| Sección | Uso |
|--------|-----|
| **SQLServer:ConnectionString** | Cadena de conexión a SQL Server (usada por `AppDbContext` de Sidae.Commons). |
| **Azure** | Parámetros para autenticación con Azure AD (tenant, client, secret, domain). |
| **KeyVault:Name** | Nombre del Key Vault si se usa para cargar secretos en lugar de appsettings. |

---

## Consideraciones

- **Autenticación:** Los endpoints están protegidos con `[Authorize]`; se requiere un token JWT válido (por ejemplo desde Azure AD) en el header `Authorization: Bearer <token>`.
- **Versiones de EF Core:** El Backend y **Sidae.Commons** deben usar la misma versión de Entity Framework Core (10.0.5) para evitar conflictos de carga de ensamblados.
- **Swagger:** En desarrollo se habilita Swagger para probar la API; en producción conviene deshabilitarlo o restringir su acceso.
- **Health checks:** Se registra un health check sobre el `AppDbContext`; útil para orquestadores y balanceadores.

---

## Licencia

Este proyecto está bajo la licencia MIT.

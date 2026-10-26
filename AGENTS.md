# AGENTS.md

> `README.md` está desactualizado a propósito por fases: el backend real hoy es **Spring Boot 3.5 / Java 21** en `backend-spring/` (rama `dev`). El backend .NET 10 en `backend/` está congelado como referencia del legado. Confía en los `pom.xml`/`docker-compose.yml`, no en la prosa.

## Layout
- `front/` — React 19 + Vite 7 + TS, router v7, alias `@` → `front/src`. Servicios en `src/services/api/` contra la API real (sin mocks): `auth`, `students`, `records` (+documentos/verify/observations/history/recent), `requests` (+público), `tasks`, `users`, `catalog`, `reports`. Páginas de configuración/atajos estáticas.
- `backend-spring/` — microservicios activos (parent Maven multi-módulo): `auth-service` (8081), `catalog-service` (8082), `students-service` (8083), `records-service` (8084), `requests-service` (8085), `tasks-service` (8086), `reports-service` (8087), más `commons` (JWT, `ApiResponse`, manejo de errores, `SecurityConfig`). **Nota local:** en esta máquina los puertos de host 8081/8082 están ocupados (otro frontend + proceso node), así que el `.env` local (no versionado) usa `AUTH_PORT=18081` y `CATALOG_PORT=18082`; `docker-compose.yml` y `.env.example` mantienen los canónicos.
- `backend/` — legado .NET 10 (6 soluciones: authentication, commons, documents, security, sidae, support). No añadir features aquí; úsalo para entender reglas y modelo.
- `migrations/` — FluentMigrator del legado (prefijo `SM`, SQL Server). El esquema nuevo usa **Flyway** por servicio (`src/main/resources/db/migration/V1__init.sql`).
- `docs/` — artefactos RUP y mockups. `docs/casos-de-uso.md` contiene la matriz CU ↔ implementación; actualízala al cerrar un CU.

## Comandos
- Todo el stack: `cp .env.example .env` y `docker compose up --build`. Front en `http://localhost:8080`, Mailpit en `http://localhost:8025`.
- Un servicio: `docker compose up --build auth-service`.
- Frontend local: `cd front` → `npm ci`, `npm run dev`, `npm run build` (`tsc -b && vite build`), `npm run lint`. No hay runner de tests.
- Backend local (requiere JDK 21 + Maven, no instalados en esta máquina): `cd backend-spring` → `mvn -pl auth-service -am test`; un test: `mvn -pl <servicio> -am test -Dtest=Clase#metodo`.
- Solo compilar: `docker compose build <servicio>` (el Dockerfile es genérico y recibe `--build-arg SERVICE`).

## Convenciones
- Cada servicio es dueño de su base: `sidae_auth`, `sidae_catalog`, `sidae_students`, `sidae_records`, `sidae_requests`, `sidae_tasks`. `reports-service` no tiene BD: agrega por HTTP (RestClient). No consultes la BD de otro servicio.
- Enrutamiento: Nginx (`front/nginx.conf`) expone `/api/v1/<recurso>` y hace proxy al servicio; no hay gateway Java ni service discovery (DNS de Compose).
- Seguridad: JWT HS256 emitido por `auth-service`; todos los servicios validan con el mismo `JWT_SECRET` (≥32 bytes) vía `commons`. Roles: `Administrador`, `Verificador`, `Asistente`, `Estudiante`, `Usuario`. Usa `@PreAuthorize("hasRole('Administrador')")` para escrituras administrativas.
- Respuestas: siempre `ApiResponse<T>` (`{success, data, error}`); errores de negocio con `ApiException` (el handler global los traduce). No devuelvas entidades JPA: usa records DTO.
- JPA: `ddl-auto: validate` contra el esquema Flyway. Cualquier cambio de entidad exige una migración nueva; IDs de migración inmutables.
- `commons` se escanea con `@SpringBootApplication(scanBasePackages = "com.cid.sidae")`; no lo cambies a un paquete más específico o se pierden seguridad y handler.
- Front: páginas por rol en `src/pages/{admin,verifier,assistant,public,auth}`, rutas en `src/routes/index.tsx`, API en `src/services/api/`. Importa con `@/...`.
- CI legado: Azure Pipelines por servicio .NET (rama `main`), con xUnit + Coverlet. La rama de desarrollo es `dev`; `main` recibe merges.

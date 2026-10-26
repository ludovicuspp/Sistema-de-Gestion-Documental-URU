# Sistema de Gestión de Expedientes - CID URU

![Status](https://img.shields.io/badge/Estado-Refactor_a_Spring_Boot-orange)
![Methodology](https://img.shields.io/badge/Metodología-RUP-blue)
![Stack](https://img.shields.io/badge/Tech-Spring_Boot_%7C_React_%7C_PostgreSQL-green)

Sistema de digitalización y gestión de expedientes académicos para el **Centro de Información y Documentación (CID)** de la **Universidad Rafael Urdaneta (URU)**. Conserva la documentación de más de 50 años de la universidad.

Desarrollo iterativo e incremental bajo **RUP** (casos de uso + arquitectura). La rama de desarrollo es **`dev`**.

## Arquitectura

| Capa | Tecnología |
| :--- | :--- |
| Frontend | React 19 + Vite 7 + TypeScript |
| Backend | Spring Boot 3.5 / Java 21 — microservicios |
| Datos | PostgreSQL 16 (una base por servicio) + Flyway |
| Documentos | Volumen local (`records_storage`) — sustituible por S3/R2 |
| Edge | Nginx (SPA + reverse proxy `/api/v1/*`) |
| Correo | SMTP (Mailpit en desarrollo) |

```
front (React/Nginx :8080)
  /api/v1/auth      -> auth-service      :8081
  /api/v1/users     -> auth-service      :8081
  /api/v1/catalog   -> catalog-service   :8082
  /api/v1/students  -> students-service  :8083
  /api/v1/records   -> records-service   :8084
  /api/v1/public    -> requests-service  :8085
  /api/v1/requests  -> requests-service  :8085
  /api/v1/tasks     -> tasks-service     :8086
  /api/v1/reports   -> reports-service   :8087
```

JWT HS256 emitido por `auth-service` y validado por todos los servicios. Roles: `Administrador`, `Verificador`, `Asistente`, `Estudiante`, `Usuario`.

## Estructura

```
docs/              Artefactos RUP, mockups y matriz de casos de uso
front/             React + Vite
backend-spring/    Microservicios activos (Maven multi-módulo)
  commons/         JWT, ApiResponse, errores, seguridad
  auth-service/    CU-01, CU-09, CU-10, CU-11
  catalog-service/ CU-06, CU-07
  students-service/CU-12..CU-15
  records-service/ CU-02..CU-05, CU-08, CU-21..CU-25, CU-27..CU-29
  requests-service/CU-18, CU-19
  tasks-service/   CU-16, CU-17
  reports-service/ CU-30
backend/           Legado .NET 10 (congelado, referencia)
migrations/        FluentMigrator del legado
docker-compose.yml Stack completo
```

## Requisitos

- Docker Desktop + Docker Compose (todo el stack corre en contenedores).
- Opcional para desarrollo local: Node 22, JDK 21, Maven 3.9.

## Ejecución

```bash
cp .env.example .env
docker compose up --build
```

- Aplicación: http://localhost:8080
- Bandeja de correo de prueba (CU-19): http://localhost:8025
- API directa (depuración): `http://localhost:8081..8087`
- PostgreSQL: `localhost:5433` (`sidae` / `sidae`)

Credenciales iniciales (configurables en `.env`):

| Rol | Email | Contraseña |
| :--- | :--- | :--- |
| Administrador | `admin@uru.edu.ve` | `Admin123!` |

## Casos de uso

Hay **30 CU** definidos. Estado detallado en [`docs/casos-de-uso.md`](docs/casos-de-uso.md).

Pendiente principal: conectar el front a la API (hoy usa mocks) y completar la validación de documentos obligatorios (CU-23).

## Documentación RUP

- `docs/1. Modelado de Dominio y Requisitos.docx`
- `docs/2. Priorizacion de Casos de Uso por riesgo.docx`
- `docs/3. Desarrollo de Casos de Uso.docx`
- `docs/4. Estructurar Casos de Uso.docx`
- `docs/analisis_de_problema_propuesta_y_diseño.docx`
- `docs/Diagramas/`, `docs/Mockups/`

## Autores

Proyecto académico — Universidad Rafael Urdaneta, CID.

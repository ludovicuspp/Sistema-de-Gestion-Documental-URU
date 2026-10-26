# Sistema de Gestión Documental — CID URU

![Stack](https://img.shields.io/badge/Tech-Spring_Boot_%7C_React_%7C_PostgreSQL-green)
![Methodology](https://img.shields.io/badge/Metodología-RUP-blue)

Gestión de expedientes académicos para el **Centro de Información y Documentación (CID)** de la **Universidad Rafael Urdaneta (URU)**. Desarrollo iterativo bajo **RUP**; la rama de desarrollo es **`dev`**.

## Arquitectura

| Capa | Tecnología |
| :--- | :--- |
| Frontend | React 19 + Vite 7 + TS (Nginx: SPA + proxy `/api/v1/*`, HTTP :80 + HTTPS :443) |
| Backend | Spring Boot 3.5 / Java 21 — 7 microservicios |
| Datos | PostgreSQL 16 (una base por servicio) + Flyway |
| Documentos | Volumen local en dev · S3/MinIO en prod |
| Correo | SMTP (Mailpit en dev, relay real en prod) + plantillas HTML |
| CI | GitHub Actions (tests + build + push a GHCR) |

```
front (React/Nginx :8080, :8443)
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

JWT HS256 emitido por `auth-service` y validado por todos. Roles: `Administrador`, `Verificador`, `Asistente`, `Estudiante`, `Usuario`.

## Estructura

```
docs/              RUP, matriz de CU, migración del legado
front/             React + Vite + Nginx
backend-spring/    Microservicios activos (Maven multi-módulo)
  commons/         JWT, ApiResponse, errores, seguridad, plantillas de correo
  auth-service/    Login/registro/reset/usuarios
  catalog-service/ Carreras, niveles, tipos de documento, MIME
  students-service Estudiantes + importación CSV
  records-service/ Expedientes, documentos (local/S3), verificación CU-23
  requests-service Solicitudes públicas e internas + notificaciones
  tasks-service/   Tareas
  reports-service/ Agregados + exports xlsx/pdf/csv
  migration-runner/ETL un solo uso desde el legado (docs/migracion-legado.md)
backend/           Legado .NET 10 (congelado, referencia)
migrations/        FluentMigrator del legado
scripts/           backup.sh / restore.sh
docker-compose.yml Stack completo (dev)
```

## Desarrollo local

```bash
cp .env.dev .env          # .env está ignorado; ajusta puertos si chocan en tu máquina
docker compose up -d --build
```

- App: http://localhost:8080 (https autofirmado en https://localhost:8443)
- Correo de prueba: http://localhost:8025 · MinIO: http://localhost:9001
- Login inicial: `admin@uru.edu.ve` / `Admin123!` (ver `ADMIN_*` en el `.env`)
- Un servicio: `docker compose up -d --build <servicio>`
- Tests backend (sin JDK local): `docker run --rm -v ./backend-spring:/app -v sidae-m2:/root/.m2 -w /app maven:3.9-eclipse-temurin-21 mvn -B test`
- Smoke E2E documentado en `docs/casos-de-uso.md` y `AGENTS.md`.

## Producción

```bash
cp .env.prod.example .env.prod   # completar TODOS los valores CAMBIAR-*
docker compose --env-file .env.prod up -d --build
```

Checklist:

1. `APP_ENV=prod` con `JWT_SECRET` propio (≥32 bytes; el arranque **falla** con el de ejemplo), `POSTGRES_PASSWORD` y `ADMIN_PASSWORD` rotada tras el primer login.
2. `CORS_ORIGINS` con el dominio real; rate-limit en `front/nginx.conf` según carga.
3. TLS: copiar `tls.crt`/`tls.key` al volumen `front_certs` antes de levantar (ver comentario en `.env.prod.example`); el autofirmado solo vale para dev.
4. `STORAGE_BACKEND=s3` con endpoint/bucket/creds reales (el volumen local **no escala** a >1 réplica de records-service).
5. SMTP real (`MAIL_HOST/PORT/USER/PASSWORD`, `MAIL_SMTP_AUTH/STARTTLS=true`); `FRONT_URL` público (enlaces del correo).
6. Backups programados: `scripts/backup.sh` (cron) + prueba de `scripts/restore.sh` en staging.
7. Imágenes versionadas: el workflow publica `ghcr.io/<owner>/sidae-*:dev-<sha>`; fijar `IMAGE_TAG` al desplegar.
8. Migración de datos legacy (una vez): ver `docs/migracion-legado.md` + `backend-spring/migration-runner/README.md`.

## Casos de uso

Hay **30 CU** definidos. Estado detallado en [`docs/casos-de-uso.md`](docs/casos-de-uso.md): núcleo completo de punta a punta (login, estudiantes, expedientes, verificación CU-23, solicitudes + correo, tareas, reportes + exports, importación CSV, identidad).

## Documentación RUP

`docs/1-4*.docx`, `docs/analisis_de_problema_propuesta_y_diseño.docx`, `docs/Diagramas/`, `docs/Mockups/`.

## Autores

Proyecto académico — Universidad Rafael Urdaneta, CID.

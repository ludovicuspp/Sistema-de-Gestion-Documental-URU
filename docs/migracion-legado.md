# Migración del legado (.NET / FluentMigrator) → Spring + Flyway

Origen: `migrations/Sidae.Migration/Scripts/*_Up.sql` (PostgreSQL con esquemas
`General, Security, Task, Person, Student, Record, Document, Request, Audit, System`).
Destino: 6 BD `sidae_*` con esquema Flyway `V1__init.sql` por servicio.

Estrategia: job ETL `backend-spring/migration-runner` (JdbcTemplate a ambos lados,
**idempotente por `guid_id`**: `INSERT ... ON CONFLICT (guid_id) DO NOTHING`).
Orden: catálogo → roles → usuarios → estudiantes → expedientes → documentos →
observaciones → solicitudes → tareas. Los `Id` enteros cambian; los `GuidId` se
preservan y sirven para remapear FKs.

## Mapeo tabla a tabla

| Legado | Destino | Notas |
|---|---|---|
| `General.AcademicLevel` | `catalog.academic_levels` | Upsert por nombre; se agregan `Cursos Avanzados`, `Egresado` si se referencian |
| `General.Career` | `catalog.careers` | Upsert por nombre insensible a tildes; `code` queda NULL |
| `Security.Role` | `auth.roles` | Match por nombre (`Usuario/Administrador/Verificador/Asistente`); `Estudiante` ya existe |
| `Security.User` | `auth.users` | `guid_id` preservado; `PasswordHash` **BCrypt tal cual** (legado usa BCrypt.Net, compatible); rol = `RoleId`; `RoleUser` extra se ignora y se loguea |
| `Security.Action/Endpoint/Permission` | — (se descarta) | Sin equivalente; el modelo nuevo es por roles |
| `Task.Status` + `Task.Task` | `tasks.tasks` | `Pendiente→PENDIENTE`, `En progreso→EN_PROCESO`, `Finalizada→COMPLETADA`; `AssignedToId→assigned_to_id`, `AssignedById→created_by_id` (remapeo por guid); `Capacity` se descarta |
| `Person.Person` + `Student.Student` + `Student.Status` + `Student.Career` | `students.students` | Join por `PersonId`; `ci/first_name/last_name/email/phone/birthdate`; `status` = UPPER crudo (`ACTIVO/EGRESADO/...`); `academic_level_id` por nombre; `career_id` = primera fila de `Student.Career` (extras se loguean) |
| `Record.FolderStatus/FolderType/PhysicalLocation/Folder` | `records.record_folders` | `Pendiente→PENDIENTE`, `Aprobado→APROBADO`, `Rechazado→RECHAZADO`, `Sin documentos→PENDIENTE`; `folder_type` se deriva del nivel del estudiante (`PREGRADO/POSTGRADO`, resto→`PREGRADO` + log); el `FolderType` legado se anexa a `description`; ubicación `shelf/box/row_number`; `student_ci/name` desnormalizados del join |
| `Document.MimeType` | `catalog.mime_types` | `name` = valor legado, `extension` deducida (`pdf`) |
| `Document.Type` + `TypeAcademicLevel` | `catalog.document_types` | Upsert por nombre insensible a tildes; `academic_level_id` = primer nivel (extras se loguean); `IsRequired→is_required` |
| `Document.Document` | `records.document_entries` | `stored_path` = nombre de archivo de `Url`; `content_type` por extensión; **los bytes NO migran solos**: el ETL emite `files-manifest.csv` (`guid → Url`) y el operador copia los archivos al volumen `records_storage` |
| `Record.Observation` | `records.record_observations` | `Comment→content`; `IsResolved` no existe en el destino (se descarta + log); autor remapeado con nombre |
| `Request.Status/Request/DocumentType` | `requests.requests` + `request_documents` | `Pendiente→RECIBIDA`, `Validado→COMPLETADA`, `Rechazado→RECHAZADA`; `TrackingCode` se conserva (si NULL se genera `CID-…`); `StudentId→ci/full_name/email` por joins (nullable); `comment` NULL |
| `Audit.Log` | — (se descarta) | Sin FK a expediente; la auditoría nueva parte de cero en `record_history` |
| `System.Setting` | — (se descarta) | Sin equivalente |
| `Student.Career` extra | — (se loguea) | El modelo nuevo soporta una carrera por estudiante |

## Prerrequisitos del operador

1. Restaurar un dump del legado en un Postgres accesible (`LEGACY_JDBC_URL`, `LEGACY_USER`, `LEGACY_PASSWORD`).
2. Levantar el stack (`docker compose up -d`) para que Flyway cree los esquemas destino.
3. Copiar los archivos de documentos al volumen `records_storage` según `files-manifest.csv`.
4. Ejecutar el runner (ver `backend-spring/migration-runner/README.md`): reporta
   `inserted / skipped (ya existía) / errors` por tabla. Re-ejecutable sin duplicar.

## Decisiones

- **Passwords**: sin cambios (BCrypt ambos lados; verificado en `backend/authentication`: `BCrypt.Net-Next 4.0.3`).
- **IDs**: los `BIGSERIAL` nuevos difieren; toda referencia cruzada usa `guid_id`.
- **Estados**: se preserva el valor crudo en mayúsculas salvo mapeos 1:1 documentados arriba; nada se inventa.
- **Auditoría legacy**: no migrable con fidelidad (sin vínculo a expediente); se documenta y se parte de cero.

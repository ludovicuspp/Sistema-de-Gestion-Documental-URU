# Casos de uso — estado real

Fuente funcional: `docs/1-4` (RUP) y `docs/2. Priorizacion de Casos de Uso por riesgo.docx`.
Total definidos: **30 CU** (21 con flujo detallado). Actores: Administrador, Verificador, Asistente, Estudiante (público).

## Resumen

- **Verificado punta a punta el 2026-10-26 (stack Docker):** login admin → crear estudiante → crear expediente → subir PDF → aprobar con observaciones → historial (3 eventos) → solicitud pública → seguimiento por código → COMPLETADA → correo en Mailpit → `GET /reports/summary` agregado → catálogo (9 tipos) → tarea. Front servido en `:8080` con proxy `/api/v1/*` a los servicios.
- **CU-01 completo de punta a punta** (front `LoginPage` → `auth-service` → JWT; redirección por rol).
- **Front 100% cableado a la API real** (2026-10-26): eliminados todos los servicios mock (`activityService`, `documentsService`, `indicatorsService`, `remindersService`) y todos los `MOCK_*` de las páginas. Las 20 páginas de gestión/dashboards/pública consumen los servicios; feed global de actividad vía `GET /records/history/recent`; recordatorios derivados de tareas pendientes; creación de usuarios con contraseña temporal aleatoria mostrada al admin.
- El backend .NET queda como referencia histórica (CU-01 completo, ~8 CU parciales).
- La nueva implementación Spring Boot (rama `dev`) cubre el núcleo; ver columna "Spring".

## Matriz

| CU | Caso de uso | Prioridad | .NET (estado real) | Spring (nuevo) |
|----|-------------|-----------|--------------------|----------------|
| CU-01 | Iniciar sesión | Alta | Completo: `AuthController` login/JWT | `auth-service` `/auth/login` |
| CU-02 | Consultar expedientes por estudiante | Alta | Parcial: lista por `guid`, no por cédula | `records-service` `GET /records?ci=` |
| CU-03 | Crear expediente | Alta | Parcial: sin validar estudiante ni duplicado | `records-service` `POST /records` |
| CU-04 | Editar expediente | Media | Parcial: sin bloqueo de aprobado | `records-service` `PUT /records/{id}` |
| CU-05 | Eliminar expediente | Alta | No implementado (solo update) | `records-service` `DELETE /records/{id}` |
| CU-06 | Crear tipo de documento | Media | Parcial: CRUD en `support` | `catalog-service` `POST /catalog/document-types` |
| CU-07 | Eliminar tipo de documento | Media | No implementado | `catalog-service` `DELETE` (soft) |
| CU-08 | Subir documento | Alta | Parcial: solo metadata, sin archivo | `records-service` multipart + storage |
| CU-09 | Crear usuario | Media | Parcial: solo auto-registro público | `auth-service` `POST /users` (admin) |
| CU-10 | Eliminar usuario | Media | No implementado | `auth-service` `DELETE /users/{id}` (soft) |
| CU-11 | Consultar lista de usuarios | Media | No implementado | `auth-service` `GET /users` |
| CU-12 | Consultar estudiantes | Media | No implementado (no existe entidad) | `students-service` `GET /students` |
| CU-13 | Crear estudiante | Alta | No implementado | `students-service` `POST /students` |
| CU-14 | Editar estudiante | Media | No implementado | `students-service` `PUT /students/{id}` |
| CU-15 | Eliminar estudiante | Media | No implementado | `students-service` `DELETE` + RST-05 |
| CU-16 | Crear tarea | Media | No implementado | `tasks-service` `POST /tasks` |
| CU-17 | Eliminar tarea | Media | No implementado | `tasks-service` `DELETE /tasks/{id}` |
| CU-18 | Enviar solicitud de documentos | Alta | No implementado | `requests-service` `POST /public/requests` |
| CU-19 | Recibir respuesta por correo | Alta | No implementado | `requests-service` al pasar a COMPLETADA (Mailpit) |
| CU-20 | Iniciar sesión (Verificador) | Alta | Cubierto por CU-01 | Cubierto por CU-01 |
| CU-21 | Ver expedientes registrados | Alta | Parcial (CU-02) | `records-service` `GET /records` |
| CU-22 | Ver historial de modificaciones | Alta | No implementado (no hay tabla historia) | `records-service` `GET /records/{id}/history` |
| CU-23 | Validar carga de expedientes | Muy Alta | No implementado | `records-service` `POST /records/{id}/verify` |
| CU-24 | Agregar observaciones | Alta | Parcial: CRUD de observaciones sin vínculo a documento | `records-service` `POST /records/{id}/observations` |
| CU-25 | Subir documento (Verificador) | Alta | Parcial (CU-08) | Igual que CU-08 con rol |
| CU-26 | Iniciar sesión (Asistente) | Alta | Cubierto por CU-01 | Cubierto por CU-01 |
| CU-27 | Crear expediente (Asistente) | Alta | Parcial (CU-03) | Igual que CU-03 |
| CU-28 | Consultar expedientes por estudiante (Asistente) | Alta | Parcial (CU-02) | Igual que CU-02 |
| CU-29 | Subir documento (Asistente) | Alta | Parcial (CU-08) | Igual que CU-08 |
| CU-30 | Estadísticas | Alta | No implementado | `reports-service` `GET /reports/summary` |

## Brechas funcionales que bloquean el cierre

1. Integración real del front con la API (hoy 100% mock).
2. Verificación de documentos obligatorios por tipo de estudiante (CU-23) contra el catálogo.
3. Historial de auditoría inmutable (CU-22) — el .NET solo tiene observaciones.
4. Regla RST-05 (egresado no editable/eliminable) aplicada en expedientes, no solo estudiantes.
5. Notificación por correo real (CU-19) y plantillas.
6. Importación masiva de estudiantes y reportes exportables (PDF/Excel).
7. Migración de datos existentes (.NET/FluentMigrator → Flyway).

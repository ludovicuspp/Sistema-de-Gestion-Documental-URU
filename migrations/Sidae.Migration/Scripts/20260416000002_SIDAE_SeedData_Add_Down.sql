-- =============================================
-- SIDAE — SeedData_Add (revertir datos estáticos)
-- =============================================
-- Debe deshacer en orden inverso o con DELETE acotado por claves naturales,
-- según lo insertado en SeedData_Add_Up.sql.
-- =============================================

-- General.AcademicLevel (solo si ningún estudiante lo referencia)
DELETE FROM "General"."AcademicLevel" al
WHERE al."Name" IN ('Pregrado', 'Postgrado', 'Cursos Avanzados')
  AND NOT EXISTS (SELECT 1 FROM "Student"."Student" s WHERE s."AcademicLevelId" = al."Id");

-- General.Career (solo si ningún estudiante la tiene en Student.Career)
DELETE FROM "General"."Career" c
WHERE c."Name" IN (
    'Ingeniería Civil',
    'Ingeniería Eléctrica',
    'Ingeniería Mecánica',
    'Ingeniería Química',
    'Ingeniería Industrial',
    'Ingeniería en Computación',
    'Ingeniería de Telecomunicaciones',
    'Arquitectura',
    'Administración de Empresas',
    'Contaduría Pública',
    'Derecho',
    'Psicología',
    'Ciencias Políticas',
    'Ingeniería en Producción Animal'
)
  AND NOT EXISTS (SELECT 1 FROM "Student"."Career" sc WHERE sc."CareerId" = c."Id");

-- Security.Action (solo si ningún Permission la referencia)
DELETE FROM "Security"."Action" a
WHERE a."Name" IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')
  AND NOT EXISTS (SELECT 1 FROM "Security"."Permission" p WHERE p."ActionId" = a."Id");

-- Task.Status (solo si ninguna Task.Task lo usa)
DELETE FROM "Task"."Status" s
WHERE s."Name" IN ('Pendiente', 'En progreso', 'Completado')
  AND NOT EXISTS (SELECT 1 FROM "Task"."Task" t WHERE t."StatusId" = s."Id");

-- Student.Status (solo si ningún Student.Student lo usa)
DELETE FROM "Student"."Status" st
WHERE st."Name" IN (
    'Activo',
    'Inactivo',
    'Suspendido',
    'En prórroga',
    'Egresado',
    'Retirado'
)
  AND NOT EXISTS (SELECT 1 FROM "Student"."Student" s WHERE s."StudentStatusId" = st."Id");

-- Document.Type — tipos de documentos del expediente estudiantil
DELETE FROM "Document"."Type"
WHERE "Name" IN (
    'Cédula de Identidad',
    'Partida de Nacimiento',
    'Fondo Negro Título de Bachiller',
    'Notas Certificadas',
    'Suscripción Militar',
    'Manejo de Idioma',
    'Constancia de Servicio Comunitario',
    'Constancia de Pasantías',
    'Certificado de Aprobación OPSU',
    'Veredicto',
    'Repetición de Expediente'
);

-- Roles semilla (solo si no hay User, Permission ni RoleUser que los usen)
DELETE FROM "Security"."Role" r
WHERE r."Name" IN ('Usuario', 'Administrador', 'Verificador', 'Asistente')
  AND NOT EXISTS (SELECT 1 FROM "Security"."User" u WHERE u."RoleId" = r."Id")
  AND NOT EXISTS (SELECT 1 FROM "Security"."Permission" p WHERE p."RoleId" = r."Id")
  AND NOT EXISTS (SELECT 1 FROM "Security"."RoleUser" ru WHERE ru."RoleId" = r."Id");

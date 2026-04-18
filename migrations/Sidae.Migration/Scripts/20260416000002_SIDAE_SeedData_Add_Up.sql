-- =============================================
-- SIDAE — SeedData_Add (datos estáticos)
-- =============================================
-- Incluir aquí todos los INSERT de datos de referencia / catálogos.
-- Secciones por dominio para mantener orden al crecer el proyecto.
-- =============================================

-- ── General.AcademicLevel — niveles académicos ────────────────────────────────
INSERT INTO "General"."AcademicLevel" ("GuidId", "Name")
SELECT gen_random_uuid(), v."Name"
FROM (VALUES ('Pregrado'), ('Postgrado'), ('Cursos Avanzados')) AS v("Name")
WHERE NOT EXISTS (
    SELECT 1 FROM "General"."AcademicLevel" a WHERE a."Name" = v."Name"
);

-- ── General.Career — carreras de pregrado (referencia: Universidad Rafael Urdaneta, Maracaibo) ──
INSERT INTO "General"."Career" ("GuidId", "Name")
SELECT gen_random_uuid(), v."Name"
FROM (VALUES
    ('Ingeniería Civil'),
    ('Ingeniería Eléctrica'),
    ('Ingeniería Mecánica'),
    ('Ingeniería Química'),
    ('Ingeniería Industrial'),
    ('Ingeniería en Computación'),
    ('Ingeniería de Telecomunicaciones'),
    ('Arquitectura'),
    ('Administración de Empresas'),
    ('Contaduría Pública'),
    ('Derecho'),
    ('Psicología'),
    ('Ciencias Políticas'),
    ('Ingeniería en Producción Animal')
) AS v("Name")
WHERE NOT EXISTS (
    SELECT 1 FROM "General"."Career" c WHERE c."Name" = v."Name"
);

-- ── Security.Action — métodos HTTP ──────────────────────────────────────────
INSERT INTO "Security"."Action" ("GuidId", "Name")
SELECT gen_random_uuid(), v."Name"
FROM (VALUES ('GET'), ('POST'), ('PUT'), ('PATCH'), ('DELETE')) AS v("Name")
WHERE NOT EXISTS (
    SELECT 1 FROM "Security"."Action" a WHERE a."Name" = v."Name"
);

-- ── Security.Role — catálogo (incluye rol de registro público: Auth:DefaultRegisterRoleName = Usuario)
INSERT INTO "Security"."Role" ("GuidId", "Name")
SELECT gen_random_uuid(), v."Name"
FROM (VALUES
    ('Usuario'),
    ('Administrador'),
    ('Verificador'),
    ('Asistente')
) AS v("Name")
WHERE NOT EXISTS (
    SELECT 1 FROM "Security"."Role" r WHERE r."Name" = v."Name"
);

-- ── Task.Status — estados de tarea ────────────────────────────────────────────
INSERT INTO "Task"."Status" ("GuidId", "Name")
SELECT gen_random_uuid(), v."Name"
FROM (VALUES ('Pendiente'), ('En progreso'), ('Completado')) AS v("Name")
WHERE NOT EXISTS (
    SELECT 1 FROM "Task"."Status" s WHERE s."Name" = v."Name"
);

-- ── Student.Status — situación académica del estudiante ───────────────────────
INSERT INTO "Student"."Status" ("GuidId", "Name")
SELECT gen_random_uuid(), v."Name"
FROM (VALUES
    ('Activo'),
    ('Inactivo'),
    ('Suspendido'),
    ('En prórroga'),
    ('Egresado'),
    ('Retirado')
) AS v("Name")
WHERE NOT EXISTS (
    SELECT 1 FROM "Student"."Status" st WHERE st."Name" = v."Name"
);

-- ── Record.FolderStatus — estados del expediente / carpeta documental ─────────
INSERT INTO "Record"."FolderStatus" ("GuidId", "Name")
SELECT gen_random_uuid(), v."Name"
FROM (VALUES
    ('Borrador'),
    ('Pendiente de revisión'),
    ('En revisión'),
    ('Con observaciones'),
    ('Aprobado'),
    ('Rechazado'),
    ('Archivado')
) AS v("Name")
WHERE NOT EXISTS (
    SELECT 1 FROM "Record"."FolderStatus" fs WHERE fs."Name" = v."Name"
);

-- ── Record.FolderType — tipos de expediente / legajo documental ───────────────
INSERT INTO "Record"."FolderType" ("GuidId", "Name")
SELECT gen_random_uuid(), v."Name"
FROM (VALUES
    ('Académico'),
    ('Ingreso y admisión'),
    ('Pasantías'),
    ('Servicio comunitario'),
    ('Graduación y titulación'),
    ('Disciplinario'),
    ('Becas y ayudas'),
    ('Prórrogas y convalidaciones')
) AS v("Name")
WHERE NOT EXISTS (
    SELECT 1 FROM "Record"."FolderType" ft WHERE ft."Name" = v."Name"
);

-- ── Document.Type — Tipos de documentos del expediente estudiantil ───────────
-- RequiredLevel: 'Todos' | 'Pregrado' | 'Postgrado' | 'Egresado'
-- IsMandatory  : true = obligatorio para ese nivel, false = opcional

INSERT INTO "Document"."Type" ("Name", "IsMandatory", "RequiredLevel") VALUES

-- Documentos comunes a todos los niveles
('Cédula de Identidad',                    TRUE,  'Todos'),
('Partida de Nacimiento',                  TRUE,  'Todos'),
('Fondo Negro Título de Bachiller',        TRUE,  'Todos'),
('Notas Certificadas',                     TRUE,  'Todos'),
('Suscripción Militar',                    FALSE, 'Todos'),
('Manejo de Idioma',                       FALSE, 'Todos'),
('Constancia de Servicio Comunitario',     TRUE,  'Todos'),
('Constancia de Pasantías',                TRUE,  'Todos'),

-- Pregrado
('Certificado de Aprobación OPSU',         TRUE,  'Pregrado'),

-- Egresado
('Veredicto',                              TRUE,  'Egresado'),
('Repetición de Expediente',               FALSE, 'Egresado');

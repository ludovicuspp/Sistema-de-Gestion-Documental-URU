-- =============================================
-- SIDAE — SeedData_Add (datos estáticos)
-- =============================================
-- Incluir aquí todos los INSERT de datos de referencia / catálogos.
-- Secciones por dominio para mantener orden al crecer el proyecto.
-- =============================================

-- ── General.AcademicLevel — niveles académicos ────────────────────────────────
INSERT INTO "General"."AcademicLevel" ("GuidId", "Name")
SELECT gen_random_uuid(), v."Name"
FROM (VALUES ('Pregrado'), ('Postgrado'), ('Cursos Avanzados'), ('Egresado')) AS v("Name")
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
FROM (VALUES ('Pendiente'), ('En progreso'), ('Finalizada')) AS v("Name")
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
    ('Pendiente'),
    ('Sin documentos'),
    ('Rechazado'),
    ('Aprobado')
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

-- ── Document.MimeType — PDF (IANA y alias histórico) ──────────────────────────
INSERT INTO "Document"."MimeType" ("GuidId", "Name")
SELECT gen_random_uuid(), v."Name"
FROM (VALUES
    ('application/pdf'),
    ('application/x-pdf')
) AS v("Name")
WHERE NOT EXISTS (
    SELECT 1 FROM "Document"."MimeType" m WHERE m."Name" = v."Name"
);

-- ── Document.Type — Tipos de documentos del expediente estudiantil ───────────
-- Niveles asociados: Document.TypeAcademicLevel → General.AcademicLevel

INSERT INTO "Document"."Type" ("Name", "IsRequired")
SELECT v."Name", v."IsRequired"
FROM (VALUES
    ('Cédula de identidad', TRUE),
    ('Fondo negro del título de bachiller', TRUE),
    ('Fondo negro del título de Pregrado', TRUE),
    ('Fondo negro de notas certificadas', TRUE),
    ('Partida de nacimiento', TRUE),
    ('Certificado de participación de OPSU', TRUE),
    ('Repetición de expediente', FALSE),
    ('Veredicto', TRUE),
    ('Inscripción militar', FALSE),
    ('Manejo de idioma', FALSE),
    ('Solvencia', TRUE)
) AS v("Name", "IsRequired")
WHERE NOT EXISTS (SELECT 1 FROM "Document"."Type" t WHERE t."Name" = v."Name");

-- Asociación tipo de documento ↔ nivel académico (muchos a muchos)
INSERT INTO "Document"."TypeAcademicLevel" ("GuidId", "DocumentTypeId", "AcademicLevelId")
SELECT gen_random_uuid(), t."Id", l."Id"
FROM (VALUES
    ('Cédula de identidad', 'Pregrado'),
    ('Cédula de identidad', 'Postgrado'),
    ('Fondo negro del título de bachiller', 'Pregrado'),
    ('Fondo negro del título de Pregrado', 'Postgrado'),
    ('Fondo negro de notas certificadas', 'Pregrado'),
    ('Fondo negro de notas certificadas', 'Postgrado'),
    ('Partida de nacimiento', 'Pregrado'),
    ('Partida de nacimiento', 'Postgrado'),
    ('Certificado de participación de OPSU', 'Pregrado'),
    ('Repetición de expediente', 'Egresado'),
    ('Veredicto', 'Egresado'),
    ('Inscripción militar', 'Pregrado'),
    ('Manejo de idioma', 'Pregrado'),
    ('Manejo de idioma', 'Postgrado'),
    ('Solvencia', 'Postgrado')
) AS v(doc_name, level_name)
INNER JOIN "Document"."Type" t ON t."Name" = v.doc_name
INNER JOIN "General"."AcademicLevel" l ON l."Name" = v.level_name
WHERE NOT EXISTS (
    SELECT 1 FROM "Document"."TypeAcademicLevel" x
    WHERE x."DocumentTypeId" = t."Id" AND x."AcademicLevelId" = l."Id"
);

-- ── Request.Status — estados de solicitud ────────────────────────────────────
INSERT INTO "Request"."Status" ("GuidId", "Name")
SELECT gen_random_uuid(), v."Name"
FROM (VALUES ('Pendiente'), ('Validado'), ('Rechazado')) AS v("Name")
WHERE NOT EXISTS (
    SELECT 1 FROM "Request"."Status" rs WHERE rs."Name" = v."Name"
);

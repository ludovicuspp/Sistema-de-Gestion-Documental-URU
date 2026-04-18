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

-- Rol de registro (solo si ningún usuario lo referencia)
DELETE FROM "Security"."Role" r
WHERE r."Name" = 'Usuario'
  AND NOT EXISTS (SELECT 1 FROM "Security"."User" u WHERE u."RoleId" = r."Id");

-- =============================================
-- Seed Down: Eliminar tipos de documentos del expediente estudiantil
-- =============================================

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

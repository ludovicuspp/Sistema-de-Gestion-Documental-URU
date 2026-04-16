-- =============================================
-- Seed: Document.Type — Tipos de documentos del expediente estudiantil
-- =============================================
-- RequiredLevel: 'Todos' | 'Pregrado' | 'Postgrado' | 'Egresado'
-- IsMandatory  : true = obligatorio para ese nivel, false = opcional

INSERT INTO "Document"."Type" ("Name", "IsMandatory", "RequiredLevel") VALUES

-- ── Documentos comunes a todos los niveles ──────────────────────────────────
('Cédula de Identidad',                    TRUE,  'Todos'),
('Partida de Nacimiento',                  TRUE,  'Todos'),
('Fondo Negro Título de Bachiller',        TRUE,  'Todos'),
('Notas Certificadas',                     TRUE,  'Todos'),
('Suscripción Militar',                    FALSE, 'Todos'),
('Manejo de Idioma',                       FALSE, 'Todos'),
('Constancia de Servicio Comunitario',     TRUE,  'Todos'),
('Constancia de Pasantías',                TRUE,  'Todos'),

-- ── Pregrado ────────────────────────────────────────────────────────────────
('Certificado de Aprobación OPSU',         TRUE,  'Pregrado'),

-- ── Egresado ────────────────────────────────────────────────────────────────
('Veredicto',                              TRUE,  'Egresado'),
('Repetición de Expediente',               FALSE, 'Egresado');

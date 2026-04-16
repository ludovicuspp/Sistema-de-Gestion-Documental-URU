-- =============================================
-- Migration: Seed static/reference data for catalog tables
-- =============================================
-- Inserts initial values for: Person.Gender, Person.Person (system user), Document.MimeType,
-- General.Religion, General.MaritalStatus, General.Occupation, General.TherapyType, General.Emotion, Security.Action,
-- Security.Endpoint (rutas API + ActionId = verbo HTTP), Security.Role,
-- Security.Permission (roles Psicólogo=2 y Patiente=3 vs endpoints), ClinicalHistory.PatientStatus.
-- Uses explicit IDs (IDENTITY_INSERT) so that Down can remove the same rows by ID.
-- Inserts are idempotent: only insert when the table is empty (no rows for that ID).

-- =============================================
-- Person.Gender
-- =============================================
SET IDENTITY_INSERT [Person].[Gender] ON;

IF NOT EXISTS (SELECT 1 FROM [Person].[Gender] WHERE ID = 1) INSERT INTO [Person].[Gender] (ID, Name) VALUES (1, N'Masculino');
IF NOT EXISTS (SELECT 1 FROM [Person].[Gender] WHERE ID = 2) INSERT INTO [Person].[Gender] (ID, Name) VALUES (2, N'Femenino');
IF NOT EXISTS (SELECT 1 FROM [Person].[Gender] WHERE ID = 3) INSERT INTO [Person].[Gender] (ID, Name) VALUES (3, N'No binario');
IF NOT EXISTS (SELECT 1 FROM [Person].[Gender] WHERE ID = 4) INSERT INTO [Person].[Gender] (ID, Name) VALUES (4, N'Otro');
IF NOT EXISTS (SELECT 1 FROM [Person].[Gender] WHERE ID = 5) INSERT INTO [Person].[Gender] (ID, Name) VALUES (5, N'Prefiero no decir');

SET IDENTITY_INSERT [Person].[Gender] OFF;

-- =============================================
-- Person.Person — usuario sistema (auditoría / procesos sin usuario humano)
-- ID = 1 y GuidId fijos para referencia estable; ClerkUserId reservado (no es cuenta Clerk real).
-- =============================================
SET IDENTITY_INSERT [Person].[Person] ON;

IF NOT EXISTS (SELECT 1 FROM [Person].[Person] WHERE ID = 1)
    INSERT INTO [Person].[Person] (
        ID, GuidId, FirstName, LastName, IdentityNumber, Email, PhoneNumber, BirthDate,
        CreatedAt, CreatedBy, UpdatedAt, UpdatedBy, Active, GenderId, ClerkUserId)
    VALUES (
        1,
        CAST(N'F0000000-0000-4000-8000-000000000001' AS UNIQUEIDENTIFIER),
        N'System',
        N'User',
        NULL,
        N'system@internal.local',
        NULL,
        NULL,
        GETDATE(),
        NULL,
        NULL,
        NULL,
        1,
        NULL,
        N'__stellarismind_system__');

SET IDENTITY_INSERT [Person].[Person] OFF;

-- =============================================
-- Document.MimeType (solo IDs 1-4 activos; el resto comentado para uso futuro)
-- =============================================
SET IDENTITY_INSERT [Document].[MimeType] ON;

-- Activos: 1 = application/pdf, 2 = application/msword, 3 = image/jpeg, 4 = image/png
IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 1) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (1, N'application/pdf');
IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 2) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (2, N'application/msword');
IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 3) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (3, N'image/jpeg');
IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 4) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (4, N'image/png');

-- Resto comentados (descomentar y ajustar IDs si se quieren añadir después):
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 5)  INSERT INTO [Document].[MimeType] (ID, Name) VALUES (5, N'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 6)  INSERT INTO [Document].[MimeType] (ID, Name) VALUES (6, N'application/vnd.ms-excel');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 7)  INSERT INTO [Document].[MimeType] (ID, Name) VALUES (7, N'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 8)  INSERT INTO [Document].[MimeType] (ID, Name) VALUES (8, N'text/plain');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 9)  INSERT INTO [Document].[MimeType] (ID, Name) VALUES (9, N'text/csv');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 10) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (10, N'application/rtf');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 11) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (11, N'application/zip');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 12) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (12, N'image/gif');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 13) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (13, N'image/webp');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 14) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (14, N'image/svg+xml');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 15) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (15, N'image/bmp');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 16) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (16, N'image/tiff');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 17) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (17, N'application/json');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 18) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (18, N'application/xml');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 19) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (19, N'application/vnd.oasis.opendocument.text');
-- IF NOT EXISTS (SELECT 1 FROM [Document].[MimeType] WHERE ID = 20) INSERT INTO [Document].[MimeType] (ID, Name) VALUES (20, N'application/octet-stream');

SET IDENTITY_INSERT [Document].[MimeType] OFF;

-- =============================================
-- General.Religion (creencias y opción de no declarar)
-- =============================================
SET IDENTITY_INSERT [General].[Religion] ON;

IF NOT EXISTS (SELECT 1 FROM [General].[Religion] WHERE ID = 1)  INSERT INTO [General].[Religion] (ID, Name) VALUES (1, N'Catolicismo');
IF NOT EXISTS (SELECT 1 FROM [General].[Religion] WHERE ID = 2)  INSERT INTO [General].[Religion] (ID, Name) VALUES (2, N'Cristianismo');
IF NOT EXISTS (SELECT 1 FROM [General].[Religion] WHERE ID = 3)  INSERT INTO [General].[Religion] (ID, Name) VALUES (3, N'Protestantismo');
IF NOT EXISTS (SELECT 1 FROM [General].[Religion] WHERE ID = 4)  INSERT INTO [General].[Religion] (ID, Name) VALUES (4, N'Judaísmo');
IF NOT EXISTS (SELECT 1 FROM [General].[Religion] WHERE ID = 5)  INSERT INTO [General].[Religion] (ID, Name) VALUES (5, N'Islam');
IF NOT EXISTS (SELECT 1 FROM [General].[Religion] WHERE ID = 6)  INSERT INTO [General].[Religion] (ID, Name) VALUES (6, N'Budismo');
IF NOT EXISTS (SELECT 1 FROM [General].[Religion] WHERE ID = 7)  INSERT INTO [General].[Religion] (ID, Name) VALUES (7, N'Hinduismo');
IF NOT EXISTS (SELECT 1 FROM [General].[Religion] WHERE ID = 8)  INSERT INTO [General].[Religion] (ID, Name) VALUES (8, N'Ateísmo');
IF NOT EXISTS (SELECT 1 FROM [General].[Religion] WHERE ID = 9)  INSERT INTO [General].[Religion] (ID, Name) VALUES (9, N'Agnosticismo');
IF NOT EXISTS (SELECT 1 FROM [General].[Religion] WHERE ID = 10) INSERT INTO [General].[Religion] (ID, Name) VALUES (10, N'Espiritualidad');
IF NOT EXISTS (SELECT 1 FROM [General].[Religion] WHERE ID = 11) INSERT INTO [General].[Religion] (ID, Name) VALUES (11, N'Otra');
IF NOT EXISTS (SELECT 1 FROM [General].[Religion] WHERE ID = 12) INSERT INTO [General].[Religion] (ID, Name) VALUES (12, N'Prefiero no decir');

SET IDENTITY_INSERT [General].[Religion] OFF;

-- =============================================
-- General.MaritalStatus (estado civil)
-- =============================================
SET IDENTITY_INSERT [General].[MaritalStatus] ON;

IF NOT EXISTS (SELECT 1 FROM [General].[MaritalStatus] WHERE ID = 1) INSERT INTO [General].[MaritalStatus] (ID, Name) VALUES (1, N'Soltero/a');
IF NOT EXISTS (SELECT 1 FROM [General].[MaritalStatus] WHERE ID = 2) INSERT INTO [General].[MaritalStatus] (ID, Name) VALUES (2, N'Casado/a');
IF NOT EXISTS (SELECT 1 FROM [General].[MaritalStatus] WHERE ID = 3) INSERT INTO [General].[MaritalStatus] (ID, Name) VALUES (3, N'Divorciado/a');
IF NOT EXISTS (SELECT 1 FROM [General].[MaritalStatus] WHERE ID = 4) INSERT INTO [General].[MaritalStatus] (ID, Name) VALUES (4, N'Viudo/a');
IF NOT EXISTS (SELECT 1 FROM [General].[MaritalStatus] WHERE ID = 5) INSERT INTO [General].[MaritalStatus] (ID, Name) VALUES (5, N'Separado/a');
IF NOT EXISTS (SELECT 1 FROM [General].[MaritalStatus] WHERE ID = 6) INSERT INTO [General].[MaritalStatus] (ID, Name) VALUES (6, N'Unión libre');
IF NOT EXISTS (SELECT 1 FROM [General].[MaritalStatus] WHERE ID = 7) INSERT INTO [General].[MaritalStatus] (ID, Name) VALUES (7, N'Pareja de hecho');
IF NOT EXISTS (SELECT 1 FROM [General].[MaritalStatus] WHERE ID = 8) INSERT INTO [General].[MaritalStatus] (ID, Name) VALUES (8, N'Otro');
IF NOT EXISTS (SELECT 1 FROM [General].[MaritalStatus] WHERE ID = 9) INSERT INTO [General].[MaritalStatus] (ID, Name) VALUES (9, N'Prefiero no decir');

SET IDENTITY_INSERT [General].[MaritalStatus] OFF;

-- =============================================
-- General.Occupation (situación laboral / ocupación)
-- =============================================
-- Ensure Name column is long enough for values like 'Empleado/a tiempo completo' (26+ chars)
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Occupation' AND schema_id = SCHEMA_ID('General'))
    ALTER TABLE [General].[Occupation] ALTER COLUMN Name NVARCHAR(60) NOT NULL;

SET IDENTITY_INSERT [General].[Occupation] ON;

IF NOT EXISTS (SELECT 1 FROM [General].[Occupation] WHERE ID = 1)  INSERT INTO [General].[Occupation] (ID, Name) VALUES (1, N'Estudiante');
IF NOT EXISTS (SELECT 1 FROM [General].[Occupation] WHERE ID = 2)  INSERT INTO [General].[Occupation] (ID, Name) VALUES (2, N'Empleado/a tiempo completo');
IF NOT EXISTS (SELECT 1 FROM [General].[Occupation] WHERE ID = 3)  INSERT INTO [General].[Occupation] (ID, Name) VALUES (3, N'Empleado/a tiempo parcial');
IF NOT EXISTS (SELECT 1 FROM [General].[Occupation] WHERE ID = 4)  INSERT INTO [General].[Occupation] (ID, Name) VALUES (4, N'Autónomo/a');
IF NOT EXISTS (SELECT 1 FROM [General].[Occupation] WHERE ID = 5)  INSERT INTO [General].[Occupation] (ID, Name) VALUES (5, N'En paro');
IF NOT EXISTS (SELECT 1 FROM [General].[Occupation] WHERE ID = 6)  INSERT INTO [General].[Occupation] (ID, Name) VALUES (6, N'Jubilado/a');
IF NOT EXISTS (SELECT 1 FROM [General].[Occupation] WHERE ID = 7)  INSERT INTO [General].[Occupation] (ID, Name) VALUES (7, N'Tareas del hogar');
IF NOT EXISTS (SELECT 1 FROM [General].[Occupation] WHERE ID = 8)  INSERT INTO [General].[Occupation] (ID, Name) VALUES (8, N'Incapacidad laboral');
IF NOT EXISTS (SELECT 1 FROM [General].[Occupation] WHERE ID = 9)  INSERT INTO [General].[Occupation] (ID, Name) VALUES (9, N'Baja temporal');
IF NOT EXISTS (SELECT 1 FROM [General].[Occupation] WHERE ID = 10) INSERT INTO [General].[Occupation] (ID, Name) VALUES (10, N'Otro');
IF NOT EXISTS (SELECT 1 FROM [General].[Occupation] WHERE ID = 11) INSERT INTO [General].[Occupation] (ID, Name) VALUES (11, N'Prefiero no decir');

SET IDENTITY_INSERT [General].[Occupation] OFF;

-- =============================================
-- General.TherapyType (tipos de terapia; nombre TCC supera NVARCHAR(25) del DDL base)
-- =============================================
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'TherapyType' AND schema_id = SCHEMA_ID('General'))
    ALTER TABLE [General].[TherapyType] ALTER COLUMN Name NVARCHAR(60) NOT NULL;

SET IDENTITY_INSERT [General].[TherapyType] ON;

IF NOT EXISTS (SELECT 1 FROM [General].[TherapyType] WHERE ID = 1) INSERT INTO [General].[TherapyType] (ID, Name) VALUES (1, N'Terapia Cognitivo-Conductual');

SET IDENTITY_INSERT [General].[TherapyType] OFF;

-- =============================================
-- General.Emotion (emociones habituales en registro y reestructuración TCC)
-- =============================================
SET IDENTITY_INSERT [General].[Emotion] ON;

IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 1)  INSERT INTO [General].[Emotion] (ID, Name) VALUES (1,  N'Tristeza');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 2)  INSERT INTO [General].[Emotion] (ID, Name) VALUES (2,  N'Alegría');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 3)  INSERT INTO [General].[Emotion] (ID, Name) VALUES (3,  N'Miedo');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 4)  INSERT INTO [General].[Emotion] (ID, Name) VALUES (4,  N'Rabia');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 5)  INSERT INTO [General].[Emotion] (ID, Name) VALUES (5,  N'Ansiedad');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 6)  INSERT INTO [General].[Emotion] (ID, Name) VALUES (6,  N'Culpa');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 7)  INSERT INTO [General].[Emotion] (ID, Name) VALUES (7,  N'Vergüenza');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 8)  INSERT INTO [General].[Emotion] (ID, Name) VALUES (8,  N'Frustración');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 9)  INSERT INTO [General].[Emotion] (ID, Name) VALUES (9,  N'Soledad');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 10) INSERT INTO [General].[Emotion] (ID, Name) VALUES (10, N'Irritabilidad');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 11) INSERT INTO [General].[Emotion] (ID, Name) VALUES (11, N'Desesperanza');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 12) INSERT INTO [General].[Emotion] (ID, Name) VALUES (12, N'Esperanza');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 13) INSERT INTO [General].[Emotion] (ID, Name) VALUES (13, N'Calma');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 14) INSERT INTO [General].[Emotion] (ID, Name) VALUES (14, N'Preocupación');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 15) INSERT INTO [General].[Emotion] (ID, Name) VALUES (15, N'Alivio');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 16) INSERT INTO [General].[Emotion] (ID, Name) VALUES (16, N'Sorpresa');
IF NOT EXISTS (SELECT 1 FROM [General].[Emotion] WHERE ID = 17) INSERT INTO [General].[Emotion] (ID, Name) VALUES (17, N'Asco');

SET IDENTITY_INSERT [General].[Emotion] OFF;

-- =============================================
-- Security.Action (métodos HTTP y acciones REST típicas para APIs)
-- =============================================
SET IDENTITY_INSERT [Security].[Action] ON;

-- Métodos HTTP estándar (RFC 7231 / REST)
IF NOT EXISTS (SELECT 1 FROM [Security].[Action] WHERE ID = 1) INSERT INTO [Security].[Action] (ID, Name) VALUES (1, N'GET');
IF NOT EXISTS (SELECT 1 FROM [Security].[Action] WHERE ID = 2) INSERT INTO [Security].[Action] (ID, Name) VALUES (2, N'POST');
IF NOT EXISTS (SELECT 1 FROM [Security].[Action] WHERE ID = 3) INSERT INTO [Security].[Action] (ID, Name) VALUES (3, N'PUT');
IF NOT EXISTS (SELECT 1 FROM [Security].[Action] WHERE ID = 4) INSERT INTO [Security].[Action] (ID, Name) VALUES (4, N'PATCH');
IF NOT EXISTS (SELECT 1 FROM [Security].[Action] WHERE ID = 5) INSERT INTO [Security].[Action] (ID, Name) VALUES (5, N'DELETE');
-- IF NOT EXISTS (SELECT 1 FROM [Security].[Action] WHERE ID = 6) INSERT INTO [Security].[Action] (ID, Name) VALUES (6, N'HEAD');
-- IF NOT EXISTS (SELECT 1 FROM [Security].[Action] WHERE ID = 7) INSERT INTO [Security].[Action] (ID, Name) VALUES (7, N'OPTIONS');
-- IF NOT EXISTS (SELECT 1 FROM [Security].[Action] WHERE ID = 8) INSERT INTO [Security].[Action] (ID, Name) VALUES (8, N'TRACE');
-- IF NOT EXISTS (SELECT 1 FROM [Security].[Action] WHERE ID = 9) INSERT INTO [Security].[Action] (ID, Name) VALUES (9, N'CONNECT');

-- Acciones semánticas habituales en APIs (por si se usan además del método HTTP)
-- IF NOT EXISTS (SELECT 1 FROM [Security].[Action] WHERE ID = 10) INSERT INTO [Security].[Action] (ID, Name) VALUES (10, N'LIST');
-- IF NOT EXISTS (SELECT 1 FROM [Security].[Action] WHERE ID = 11) INSERT INTO [Security].[Action] (ID, Name) VALUES (11, N'CREATE');
-- IF NOT EXISTS (SELECT 1 FROM [Security].[Action] WHERE ID = 12) INSERT INTO [Security].[Action] (ID, Name) VALUES (12, N'READ');
-- IF NOT EXISTS (SELECT 1 FROM [Security].[Action] WHERE ID = 13) INSERT INTO [Security].[Action] (ID, Name) VALUES (13, N'UPDATE');
-- IF NOT EXISTS (SELECT 1 FROM [Security].[Action] WHERE ID = 14) INSERT INTO [Security].[Action] (ID, Name) VALUES (14, N'EXECUTE');

SET IDENTITY_INSERT [Security].[Action] OFF;

-- =============================================
-- Security.Endpoint: plantilla de ruta + ActionId (FK Security.Action: 1=GET,2=POST,3=PUT,4=PATCH,5=DELETE)
-- Middleware futuro: emparejar Request.Method + ruta con ActionId + Name.
-- =============================================
IF COL_LENGTH('Security.Endpoint', 'ActionId') IS NULL
BEGIN
    ALTER TABLE [Security].[Endpoint] ALTER COLUMN [Name] NVARCHAR(300) NOT NULL;
    ALTER TABLE [Security].[Endpoint] ADD [ActionId] INT NULL;
    UPDATE [Security].[Endpoint] SET [ActionId] = 1 WHERE [ActionId] IS NULL;
    ALTER TABLE [Security].[Endpoint] ALTER COLUMN [ActionId] INT NOT NULL;
    ALTER TABLE [Security].[Endpoint] ADD CONSTRAINT [FK_Security_Endpoint_Action] FOREIGN KEY ([ActionId]) REFERENCES [Security].[Action]([ID]);
END

SET IDENTITY_INSERT [Security].[Endpoint] ON;

IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 1) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (1, N'/api/v1/gender', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 2) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (2, N'/api/v1/person', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 3) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (3, N'/api/v1/person/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 4) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (4, N'/api/v1/person', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 5) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (5, N'/api/v1/person/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 6) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (6, N'/api/v1/person/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 7) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (7, N'/api/v1/tracking-sheet', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 8) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (8, N'/api/v1/tracking-sheet/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 9) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (9, N'/api/v1/tracking-sheet', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 10) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (10, N'/api/v1/tracking-sheet/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 11) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (11, N'/api/v1/tracking-sheet/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 12) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (12, N'/api/v1/tracking-comment', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 13) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (13, N'/api/v1/tracking-comment', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 14) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (14, N'/api/v1/tracking-comment/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 15) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (15, N'/api/v1/tracking-comment/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 16) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (16, N'/api/v1/tracking-answer', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 17) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (17, N'/api/v1/tracking-answer', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 18) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (18, N'/api/v1/tracking-answer/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 19) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (19, N'/api/v1/tracking-answer/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 20) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (20, N'/api/v1/task-tracking-sheet', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 21) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (21, N'/api/v1/task-tracking-sheet/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 22) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (22, N'/api/v1/task-tracking-sheet', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 23) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (23, N'/api/v1/task-tracking-sheet/{guidId}', 4);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 24) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (24, N'/api/v1/task-tracking-sheet/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 25) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (25, N'/api/v1/task-group', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 26) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (26, N'/api/v1/task-group/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 27) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (27, N'/api/v1/task-group', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 28) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (28, N'/api/v1/task-group/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 29) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (29, N'/api/v1/task-group/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 30) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (30, N'/api/v1/task-group-assignment', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 31) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (31, N'/api/v1/task-group-assignment', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 32) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (32, N'/api/v1/task-group-assignment/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 33) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (33, N'/api/v1/task', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 34) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (34, N'/api/v1/task/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 35) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (35, N'/api/v1/task', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 36) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (36, N'/api/v1/task/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 37) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (37, N'/api/v1/task/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 38) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (38, N'/api/v1/task-answer', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 39) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (39, N'/api/v1/task-answer', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 40) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (40, N'/api/v1/task-answer/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 41) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (41, N'/api/v1/task-answer/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 42) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (42, N'/api/v1/task-document', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 43) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (43, N'/api/v1/task-document/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 44) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (44, N'/api/v1/task-document', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 45) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (45, N'/api/v1/task-document/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 46) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (46, N'/api/v1/task-answer-document', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 47) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (47, N'/api/v1/task-answer-document/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 48) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (48, N'/api/v1/task-answer-document', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 49) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (49, N'/api/v1/task-answer-document/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 50) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (50, N'/api/v1/resource-document', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 51) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (51, N'/api/v1/resource-document/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 52) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (52, N'/api/v1/resource-document', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 53) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (53, N'/api/v1/resource-document/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 54) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (54, N'/api/v1/security/role-user', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 55) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (55, N'/api/v1/security/action', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 56) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (56, N'/api/v1/security/role', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 57) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (57, N'/api/v1/resource-group', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 58) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (58, N'/api/v1/resource-group/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 59) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (59, N'/api/v1/resource-group', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 60) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (60, N'/api/v1/resource-group/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 61) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (61, N'/api/v1/resource-group/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 62) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (62, N'/api/v1/resource', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 63) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (63, N'/api/v1/resource/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 64) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (64, N'/api/v1/resource', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 65) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (65, N'/api/v1/resource/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 66) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (66, N'/api/v1/resource/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 67) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (67, N'/api/v1/religion', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 68) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (68, N'/api/v1/clinical-history/reason', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 69) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (69, N'/api/v1/clinical-history/reason', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 70) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (70, N'/api/v1/clinical-history/reason/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 71) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (71, N'/api/v1/clinical-history/reason/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 72) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (72, N'/api/v1/psychological-report', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 73) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (73, N'/api/v1/psychological-report/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 134) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (134, N'/api/v1/psychological-report', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 74) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (74, N'/api/v1/security/permission', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 75) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (75, N'/api/v1/patient-status', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 76) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (76, N'/api/v1/patient-resource', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 77) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (77, N'/api/v1/patient-resource', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 78) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (78, N'/api/v1/patient-resource/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 79) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (79, N'/api/v1/occupation', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 80) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (80, N'/api/v1/clinical-history/observation', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 81) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (81, N'/api/v1/clinical-history/observation', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 82) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (82, N'/api/v1/clinical-history/observation/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 83) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (83, N'/api/v1/clinical-history/observation/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 84) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (84, N'/api/v1/marital-status', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 85) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (85, N'/api/v1/group-resource-assignment', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 86) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (86, N'/api/v1/group-resource-assignment', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 87) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (87, N'/api/v1/group-resource-assignment/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 88) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (88, N'/api/v1/document-type', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 89) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (89, N'/api/v1/security/endpoint', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 90) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (90, N'/api/v1/document/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 91) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (91, N'/api/v1/document/{guidId}/file', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 92) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (92, N'/api/v1/clinical-history/diagnostic', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 93) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (93, N'/api/v1/clinical-history/diagnostic/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 94) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (94, N'/api/v1/clinical-history/diagnostic', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 95) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (95, N'/api/v1/clinical-history/diagnostic/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 96) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (96, N'/api/v1/clinical-history/diagnostic/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 97) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (97, N'/api/v1/clinical-history/conclusion', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 98) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (98, N'/api/v1/clinical-history/conclusion', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 99) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (99, N'/api/v1/clinical-history/conclusion/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 100) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (100, N'/api/v1/clinical-history/conclusion/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 101) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (101, N'/api/v1/clinical-history', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 102) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (102, N'/api/v1/clinical-history/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 103) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (103, N'/api/v1/clinical-history', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 104) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (104, N'/api/v1/clinical-history/{guidId}', 4);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 105) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (105, N'/api/v1/clinical-history/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 106) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (106, N'/api/v1/clinical-history/marital-status', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 107) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (107, N'/api/v1/clinical-history/marital-status', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 108) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (108, N'/api/v1/clinical-history/marital-status/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 109) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (109, N'/api/v1/clinical-history/religion', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 110) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (110, N'/api/v1/clinical-history/religion', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 111) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (111, N'/api/v1/clinical-history/religion/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 112) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (112, N'/api/v1/clinical-history/occupation', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 113) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (113, N'/api/v1/clinical-history/occupation', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 114) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (114, N'/api/v1/clinical-history/occupation/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 115) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (115, N'/api/v1/clinical-history/antecedent', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 116) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (116, N'/api/v1/clinical-history/antecedent', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 117) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (117, N'/api/v1/clinical-history/antecedent/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 118) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (118, N'/api/v1/clinical-history/antecedent/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 119) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (119, N'/api/v1/therapy-type', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 120) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (120, N'/api/v1/emotion', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 121) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (121, N'/api/v1/patient-therapy-type', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 122) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (122, N'/api/v1/patient-therapy-type', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 123) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (123, N'/api/v1/patient-therapy-type/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 124) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (124, N'/api/v1/cognitive-behavioral-therapy/record', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 125) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (125, N'/api/v1/cognitive-behavioral-therapy/record/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 126) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (126, N'/api/v1/cognitive-behavioral-therapy/record', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 127) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (127, N'/api/v1/cognitive-behavioral-therapy/record/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 128) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (128, N'/api/v1/cognitive-behavioral-therapy/record/{guidId}', 5);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 129) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (129, N'/api/v1/cognitive-behavioral-therapy/record-emotion', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 130) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (130, N'/api/v1/cognitive-behavioral-therapy/record-emotion/{guidId}', 1);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 131) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (131, N'/api/v1/cognitive-behavioral-therapy/record-emotion', 2);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 132) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (132, N'/api/v1/cognitive-behavioral-therapy/record-emotion/{guidId}', 3);
IF NOT EXISTS (SELECT 1 FROM [Security].[Endpoint] WHERE ID = 133) INSERT INTO [Security].[Endpoint] (ID, Name, ActionId) VALUES (133, N'/api/v1/cognitive-behavioral-therapy/record-emotion/{guidId}', 5);
SET IDENTITY_INSERT [Security].[Endpoint] OFF;

-- =============================================
-- Security.Role (roles de aplicación)
-- =============================================
SET IDENTITY_INSERT [Security].[Role] ON;

IF NOT EXISTS (SELECT 1 FROM [Security].[Role] WHERE ID = 1) INSERT INTO [Security].[Role] (ID, Name) VALUES (1, N'Administrador');
IF NOT EXISTS (SELECT 1 FROM [Security].[Role] WHERE ID = 2) INSERT INTO [Security].[Role] (ID, Name) VALUES (2, N'Psicologo');
IF NOT EXISTS (SELECT 1 FROM [Security].[Role] WHERE ID = 3) INSERT INTO [Security].[Role] (ID, Name) VALUES (3, N'Patiente');

SET IDENTITY_INSERT [Security].[Role] OFF;

-- =============================================
-- ClinicalHistory.PatientStatus (estado del paciente)
-- =============================================
SET IDENTITY_INSERT [ClinicalHistory].[PatientStatus] ON;

IF NOT EXISTS (SELECT 1 FROM [ClinicalHistory].[PatientStatus] WHERE ID = 1) INSERT INTO [ClinicalHistory].[PatientStatus] (ID, Name) VALUES (1, N'Inactivo');
IF NOT EXISTS (SELECT 1 FROM [ClinicalHistory].[PatientStatus] WHERE ID = 2) INSERT INTO [ClinicalHistory].[PatientStatus] (ID, Name) VALUES (2, N'Activo');
IF NOT EXISTS (SELECT 1 FROM [ClinicalHistory].[PatientStatus] WHERE ID = 3) INSERT INTO [ClinicalHistory].[PatientStatus] (ID, Name) VALUES (3, N'En Alta');

SET IDENTITY_INSERT [ClinicalHistory].[PatientStatus] OFF;

-- =============================================
-- Security.Permission: rol Psicólogo (2) y Patiente (3)
-- Cada fila autoriza (RoleId, EndpointId). El verbo HTTP va en [Security].[Endpoint].ActionId.
-- Efectos sin endpoint propio (invitación Clerk al crear historial, notificaciones push/correo
-- de informe completado, recordatorio de cita) se cubren con el POST/PATCH ya existente o backend.
-- =============================================

-- Psicólogo (2): atención psicológica + seguimiento (recursos, informes, comentarios en actividades)
INSERT INTO [Security].[Permission] (RoleId, EndpointId, Active, CreatedAt, CreatedBy)
SELECT 2, e.EndpointId, 1, GETDATE(), NULL
FROM (VALUES
    -- Historial clínico: buscar (GET list), ver (GET por id), crear (POST; incluye envío correo/invitación en servidor), editar (PATCH)
    (101), (102), (103), (104),
    -- Hoja de seguimiento: listar, ver por id/sesión, crear, editar (PUT)
    (7), (8), (9), (10),
    -- Actividades por hoja: listar asignaciones, ver una, asignar (POST), editar (PATCH), eliminar (DELETE)
    (20), (21), (22), (23), (24),
    -- Consultar catálogo de tareas/actividades al asignar (GET listado y por id)
    (33), (34),
    -- Comentarios / observaciones en seguimiento (listar, crear, editar respuesta del psicólogo)
    (12), (13), (14),
    -- Recursos: CRUD
    (62), (63), (64), (65), (66),
    -- Asignar / desasignar recursos al paciente; listar asignaciones
    (76), (77), (78),
    -- Asignación por grupos de recursos (si aplica al flujo de asignación)
    (85), (86), (87),
    -- Informe psicológico: listar/filtrar, crear (POST), reemplazar (PUT)
    (72), (134), (73),
    -- TCC: catálogos, asignación terapia–paciente, registro y emociones del registro
    (119), (120), (121), (122), (123), (124), (125), (126), (127), (128), (129), (130), (131), (132), (133)
) AS e(EndpointId)
WHERE NOT EXISTS (
    SELECT 1 FROM [Security].[Permission] p
    WHERE p.RoleId = 2 AND p.EndpointId = e.EndpointId);

-- Patiente (3): cuenta/perfil, recursos asignados, actividades de sesión, respuestas, comentarios, informe completado
INSERT INTO [Security].[Permission] (RoleId, EndpointId, Active, CreatedAt, CreatedBy)
SELECT 3, e.EndpointId, 1, GETDATE(), NULL
FROM (VALUES
    -- Activar / usar cuenta móvil: leer y actualizar propio perfil (tras Clerk u onboarding)
    (3), (5),
    -- Recursos asignados: listado; ver detalle de recurso; metadatos y archivo de documento (descarga)
    (76), (63), (50), (51), (90), (91),
    -- Actividades de la sesión: asignaciones en hoja de seguimiento y tareas
    (20), (21), (33), (34),
    -- Comentarios / observaciones en actividad
    (12), (13), (14),
    -- Subir respuesta de actividad y actualizarla; documentos adjuntos a la respuesta
    (38), (39), (40), (46), (47), (48), (49),
    -- Informes psicológicos completados (listado filtrado en aplicación)
    (72),
    -- TCC: catálogos y registro propio; sin POST/DELETE de asignación terapia (lo gestiona el psicólogo)
    (119), (120), (121), (124), (125), (126), (127), (128), (129), (130), (131), (132), (133)
) AS e(EndpointId)
WHERE NOT EXISTS (
    SELECT 1 FROM [Security].[Permission] p
    WHERE p.RoleId = 3 AND p.EndpointId = e.EndpointId);

-- =============================================
-- ClinicalHistory.RecordType (tipos de registro clínico)
-- =============================================
SET IDENTITY_INSERT [ClinicalHistory].[RecordType] ON;

IF NOT EXISTS (SELECT 1 FROM [ClinicalHistory].[RecordType] WHERE ID = 1) INSERT INTO [ClinicalHistory].[RecordType] (ID, Description) VALUES (1, N'Motivo');
IF NOT EXISTS (SELECT 1 FROM [ClinicalHistory].[RecordType] WHERE ID = 2) INSERT INTO [ClinicalHistory].[RecordType] (ID, Description) VALUES (2, N'Diagnóstico');
IF NOT EXISTS (SELECT 1 FROM [ClinicalHistory].[RecordType] WHERE ID = 3) INSERT INTO [ClinicalHistory].[RecordType] (ID, Description) VALUES (3, N'Antecedente');
IF NOT EXISTS (SELECT 1 FROM [ClinicalHistory].[RecordType] WHERE ID = 4) INSERT INTO [ClinicalHistory].[RecordType] (ID, Description) VALUES (4, N'Conclusión');
IF NOT EXISTS (SELECT 1 FROM [ClinicalHistory].[RecordType] WHERE ID = 5) INSERT INTO [ClinicalHistory].[RecordType] (ID, Description) VALUES (5, N'Observación');

SET IDENTITY_INSERT [ClinicalHistory].[RecordType] OFF;

PRINT 'Sidae static data migration completed successfully.';

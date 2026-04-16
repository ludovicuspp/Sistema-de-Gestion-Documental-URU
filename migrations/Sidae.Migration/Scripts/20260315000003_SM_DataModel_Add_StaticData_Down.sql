-- =============================================
-- Migration Down: Remove static data inserted by Up
-- =============================================
-- Removes rows with the IDs used in the Up migration.
-- References from other tables are cleared first (set to NULL or delete junction rows).

-- [Person].[Person] — usuario sistema (mismo criterio que Up: ClerkUserId reservado).
-- Limpia FKs anulables. Si quedan referencias NOT NULL (p. ej. [Tracking].[TrackingSheet].CreatedBy/UpdatedBy,
-- [Report].[PsychologicalReport].PsychologistId, [Person].[PatientTherapyType].PatientId, [CognitiveBehavioralTherapy].[Record].PatientId),
-- el DELETE fallará hasta que se reasignen o eliminen esas filas.
DECLARE @SystemPersonId INT;
SELECT @SystemPersonId = [ID] FROM [Person].[Person] WHERE [ClerkUserId] = N'__stellarismind_system__';

IF @SystemPersonId IS NOT NULL
BEGIN
    DELETE FROM [Security].[RoleUser] WHERE [UserId] = @SystemPersonId OR [CreatedBy] = @SystemPersonId;

    UPDATE [Security].[Permission] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;

    UPDATE [Person].[Person] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;
    UPDATE [Person].[Person] SET [UpdatedBy] = NULL WHERE [UpdatedBy] = @SystemPersonId;
    UPDATE [Person].[PatientTherapyType] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;
    UPDATE [Person].[PatientTherapyType] SET [UpdatedBy] = NULL WHERE [UpdatedBy] = @SystemPersonId;

    UPDATE [Task].[Group] SET [PsychologistId] = NULL WHERE [PsychologistId] = @SystemPersonId;
    UPDATE [Task].[Task] SET [PsychologistId] = NULL WHERE [PsychologistId] = @SystemPersonId;
    UPDATE [Task].[Task] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;
    UPDATE [Task].[Task] SET [UpdatedBy] = NULL WHERE [UpdatedBy] = @SystemPersonId;
    UPDATE [Task].[GroupAssignment] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;

    UPDATE [Document].[Document] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;

    UPDATE [Resource].[Resource] SET [PsychologistId] = NULL WHERE [PsychologistId] = @SystemPersonId;
    UPDATE [Resource].[Group] SET [PsychologistId] = NULL WHERE [PsychologistId] = @SystemPersonId;
    UPDATE [Resource].[GroupAssignment] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;
    UPDATE [Resource].[PatientAssignment] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;

    UPDATE [ClinicalHistory].[ClinicalHistory] SET [PatientId] = NULL WHERE [PatientId] = @SystemPersonId;
    UPDATE [ClinicalHistory].[ClinicalHistory] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;
    UPDATE [ClinicalHistory].[ClinicalHistory] SET [UpdatedBy] = NULL WHERE [UpdatedBy] = @SystemPersonId;
    UPDATE [ClinicalHistory].[Religion] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;
    UPDATE [ClinicalHistory].[MaritalStatus] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;
    UPDATE [ClinicalHistory].[Occupation] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;

    UPDATE [Tracking].[TaskAnswer] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;
    UPDATE [Tracking].[Comment] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;
    UPDATE [Tracking].[Answer] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;
    UPDATE [Tracking].[Answer] SET [UpdatedBy] = NULL WHERE [UpdatedBy] = @SystemPersonId;

    UPDATE [CognitiveBehavioralTherapy].[Record] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;
    UPDATE [CognitiveBehavioralTherapy].[Record] SET [UpdatedBy] = NULL WHERE [UpdatedBy] = @SystemPersonId;
    UPDATE [CognitiveBehavioralTherapy].[RecordEmotion] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;
    UPDATE [CognitiveBehavioralTherapy].[RecordEmotion] SET [UpdatedBy] = NULL WHERE [UpdatedBy] = @SystemPersonId;

    UPDATE [Report].[PsychologicalReport] SET [CreatedBy] = NULL WHERE [CreatedBy] = @SystemPersonId;
    UPDATE [Report].[PsychologicalReport] SET [UpdatedBy] = NULL WHERE [UpdatedBy] = @SystemPersonId;

    DELETE FROM [Person].[Person] WHERE [ID] = @SystemPersonId;
END;

-- [Person].[Gender] (IDs 1-5): [Person].[Person].GenderId references this
UPDATE [Person].[Person] SET GenderId = NULL WHERE GenderId IN (1, 2, 3, 4, 5);
DELETE FROM [Person].[Gender] WHERE ID IN (1, 2, 3, 4, 5);

-- [Document].[MimeType] (IDs 1-4): [Document].[Document].MimeTypeId references this
UPDATE [Document].[Document] SET MimeTypeId = NULL WHERE MimeTypeId IN (1, 2, 3, 4);
DELETE FROM [Document].[MimeType] WHERE ID IN (1, 2, 3, 4);

-- [General].[Religion] (IDs 1-12): [ClinicalHistory].[Religion] references this
DELETE FROM [ClinicalHistory].[Religion] WHERE ReligionId IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
DELETE FROM [General].[Religion] WHERE ID IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);

-- [General].[MaritalStatus] (IDs 1-9): [ClinicalHistory].[MaritalStatus] references this
DELETE FROM [ClinicalHistory].[MaritalStatus] WHERE MaritalStatusId IN (1, 2, 3, 4, 5, 6, 7, 8, 9);
DELETE FROM [General].[MaritalStatus] WHERE ID IN (1, 2, 3, 4, 5, 6, 7, 8, 9);

-- [General].[Occupation] (IDs 1-11): [ClinicalHistory].[Occupation] references this
DELETE FROM [ClinicalHistory].[Occupation] WHERE OccupationId IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);
DELETE FROM [General].[Occupation] WHERE ID IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);

-- [General].[Emotion] (IDs 1-17): [CognitiveBehavioralTherapy].[RecordEmotion].EmotionId
DELETE FROM [CognitiveBehavioralTherapy].[RecordEmotion] WHERE EmotionId IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
DELETE FROM [General].[Emotion] WHERE ID IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);

-- [General].[TherapyType] (ID 1): [Person].[PatientTherapyType].TherapyTypeId
DELETE FROM [Person].[PatientTherapyType] WHERE TherapyTypeId = 1;
DELETE FROM [General].[TherapyType] WHERE ID = 1;

-- [Security].[Endpoint] (IDs 1-133): [Security].[Permission] references this (antes de borrar Action)
DELETE FROM [Security].[Permission] WHERE EndpointId BETWEEN 1 AND 134;
DELETE FROM [Security].[Endpoint] WHERE ID BETWEEN 1 AND 134;

-- [Security].[Action] (IDs 1-14): [Security].[Endpoint].ActionId referenciaba esto (endpoints ya eliminados)
DELETE FROM [Security].[Action] WHERE ID IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14);

-- [Security].[Role] (IDs 1-3): [Security].[Permission], [Security].[RoleUser] reference this
DELETE FROM [Security].[Permission] WHERE RoleId IN (1, 2, 3);
DELETE FROM [Security].[RoleUser] WHERE RoleId IN (1, 2, 3);
DELETE FROM [Security].[Role] WHERE ID IN (1, 2, 3);

-- [ClinicalHistory].[PatientStatus] (IDs 1-3)
DELETE FROM [ClinicalHistory].[PatientStatus] WHERE ID IN (1, 2, 3);

-- [ClinicalHistory].[RecordType] (IDs 1-5): [ClinicalHistory].[Record].ClinicalHistoryRecordTypeId references this
DELETE FROM [ClinicalHistory].[Record] WHERE ClinicalHistoryRecordTypeId IN (1, 2, 3, 4, 5);
DELETE FROM [ClinicalHistory].[RecordType] WHERE ID IN (1, 2, 3, 4, 5);

PRINT 'Sidae static data migration rolled back successfully.';

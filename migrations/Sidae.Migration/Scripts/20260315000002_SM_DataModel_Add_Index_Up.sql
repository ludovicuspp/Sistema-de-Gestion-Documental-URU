-- =============================================
-- Migration: Add indexes for filtering and query optimization
-- =============================================
-- Nonclustered indexes on FKs, Active, dates, and search columns.

-- [Person].[Person]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_Person_Active' AND object_id = OBJECT_ID('[Person].[Person]'))
    CREATE NONCLUSTERED INDEX IX_Person_Person_Active ON [Person].[Person](Active);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_Person_Email' AND object_id = OBJECT_ID('[Person].[Person]'))
    CREATE NONCLUSTERED INDEX IX_Person_Person_Email ON [Person].[Person](Email);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_Person_IdentityNumber' AND object_id = OBJECT_ID('[Person].[Person]'))
    CREATE NONCLUSTERED INDEX IX_Person_Person_IdentityNumber ON [Person].[Person](IdentityNumber);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_Person_GenderId' AND object_id = OBJECT_ID('[Person].[Person]'))
    CREATE NONCLUSTERED INDEX IX_Person_Person_GenderId ON [Person].[Person](GenderId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_Person_CreatedAt' AND object_id = OBJECT_ID('[Person].[Person]'))
    CREATE NONCLUSTERED INDEX IX_Person_Person_CreatedAt ON [Person].[Person](CreatedAt);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_Person_LastName_FirstName' AND object_id = OBJECT_ID('[Person].[Person]'))
    CREATE NONCLUSTERED INDEX IX_Person_Person_LastName_FirstName ON [Person].[Person](LastName, FirstName);

-- [Task].[Group]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Group_Name' AND object_id = OBJECT_ID('Task.Group'))
    CREATE NONCLUSTERED INDEX IX_Task_Group_Name ON [Task].[Group](Name);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Group_PsychologistId' AND object_id = OBJECT_ID('Task.Group'))
    CREATE NONCLUSTERED INDEX IX_Task_Group_PsychologistId ON [Task].[Group](PsychologistId);

-- [Task].[Task]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Task_Name' AND object_id = OBJECT_ID('[Task].[Task]'))
    CREATE NONCLUSTERED INDEX IX_Task_Task_Name ON [Task].[Task](Name);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Task_CreatedAt' AND object_id = OBJECT_ID('[Task].[Task]'))
    CREATE NONCLUSTERED INDEX IX_Task_Task_CreatedAt ON [Task].[Task](CreatedAt);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Task_CreatedBy' AND object_id = OBJECT_ID('[Task].[Task]'))
    CREATE NONCLUSTERED INDEX IX_Task_Task_CreatedBy ON [Task].[Task](CreatedBy);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Task_PsychologistId' AND object_id = OBJECT_ID('[Task].[Task]'))
    CREATE NONCLUSTERED INDEX IX_Task_Task_PsychologistId ON [Task].[Task](PsychologistId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Task_Active' AND object_id = OBJECT_ID('[Task].[Task]'))
    CREATE NONCLUSTERED INDEX IX_Task_Task_Active ON [Task].[Task](Active);

-- [Task].[GroupAssignment]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_GroupAssignment_TaskId' AND object_id = OBJECT_ID('[Task].[GroupAssignment]'))
    CREATE NONCLUSTERED INDEX IX_Task_GroupAssignment_TaskId ON [Task].[GroupAssignment](TaskId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_GroupAssignment_TaskGroupId' AND object_id = OBJECT_ID('[Task].[GroupAssignment]'))
    CREATE NONCLUSTERED INDEX IX_Task_GroupAssignment_TaskGroupId ON [Task].[GroupAssignment](TaskGroupId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_GroupAssignment_Active' AND object_id = OBJECT_ID('[Task].[GroupAssignment]'))
    CREATE NONCLUSTERED INDEX IX_Task_GroupAssignment_Active ON [Task].[GroupAssignment](Active);

-- [Task].[Document]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Document_TaskId' AND object_id = OBJECT_ID('[Task].[Document]'))
    CREATE NONCLUSTERED INDEX IX_Task_Document_TaskId ON [Task].[Document](TaskId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Document_DocumentId' AND object_id = OBJECT_ID('[Task].[Document]'))
    CREATE NONCLUSTERED INDEX IX_Task_Document_DocumentId ON [Task].[Document](DocumentId);

-- [Document].[MimeType]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Document_MimeType_Name' AND object_id = OBJECT_ID('[Document].[MimeType]'))
    CREATE NONCLUSTERED INDEX IX_Document_MimeType_Name ON [Document].[MimeType](Name);

-- [Document].[Document]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Document_Document_MimeTypeId' AND object_id = OBJECT_ID('[Document].[Document]'))
    CREATE NONCLUSTERED INDEX IX_Document_Document_MimeTypeId ON [Document].[Document](MimeTypeId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Document_Document_FolderId' AND object_id = OBJECT_ID('[Document].[Document]'))
    CREATE NONCLUSTERED INDEX IX_Document_Document_FolderId ON [Document].[Document](FolderId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Document_Document_Active' AND object_id = OBJECT_ID('[Document].[Document]'))
    CREATE NONCLUSTERED INDEX IX_Document_Document_Active ON [Document].[Document](Active);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Document_Document_CreatedAt' AND object_id = OBJECT_ID('[Document].[Document]'))
    CREATE NONCLUSTERED INDEX IX_Document_Document_CreatedAt ON [Document].[Document](CreatedAt);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Document_Document_Name' AND object_id = OBJECT_ID('[Document].[Document]'))
    CREATE NONCLUSTERED INDEX IX_Document_Document_Name ON [Document].[Document](Name);

-- [Resource].[Resource]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_Resource_PsychologistId' AND object_id = OBJECT_ID('[Resource].[Resource]'))
    CREATE NONCLUSTERED INDEX IX_Resource_Resource_PsychologistId ON [Resource].[Resource](PsychologistId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_Resource_Name' AND object_id = OBJECT_ID('[Resource].[Resource]'))
    CREATE NONCLUSTERED INDEX IX_Resource_Resource_Name ON [Resource].[Resource](Name);

-- [Resource].[Group]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_Group_PsychologistId' AND object_id = OBJECT_ID('Resource.Group'))
    CREATE NONCLUSTERED INDEX IX_Resource_Group_PsychologistId ON [Resource].[Group](PsychologistId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_Group_Name' AND object_id = OBJECT_ID('Resource.Group'))
    CREATE NONCLUSTERED INDEX IX_Resource_Group_Name ON [Resource].[Group](Name);

-- [Resource].[GroupAssignment]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_GroupAssignment_ResourceId' AND object_id = OBJECT_ID('[Resource].[GroupAssignment]'))
    CREATE NONCLUSTERED INDEX IX_Resource_GroupAssignment_ResourceId ON [Resource].[GroupAssignment](ResourceId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_GroupAssignment_ResourceGroupId' AND object_id = OBJECT_ID('[Resource].[GroupAssignment]'))
    CREATE NONCLUSTERED INDEX IX_Resource_GroupAssignment_ResourceGroupId ON [Resource].[GroupAssignment](ResourceGroupId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_GroupAssignment_Active' AND object_id = OBJECT_ID('[Resource].[GroupAssignment]'))
    CREATE NONCLUSTERED INDEX IX_Resource_GroupAssignment_Active ON [Resource].[GroupAssignment](Active);

-- [Resource].[PatientAssignment]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_PatientAssignment_ResourceId' AND object_id = OBJECT_ID('[Resource].[PatientAssignment]'))
    CREATE NONCLUSTERED INDEX IX_Resource_PatientAssignment_ResourceId ON [Resource].[PatientAssignment](ResourceId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_PatientAssignment_PatientId' AND object_id = OBJECT_ID('[Resource].[PatientAssignment]'))
    CREATE NONCLUSTERED INDEX IX_Resource_PatientAssignment_PatientId ON [Resource].[PatientAssignment](PatientId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_PatientAssignment_Active' AND object_id = OBJECT_ID('[Resource].[PatientAssignment]'))
    CREATE NONCLUSTERED INDEX IX_Resource_PatientAssignment_Active ON [Resource].[PatientAssignment](Active);

-- [Security].[Permission]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_Permission_RoleId' AND object_id = OBJECT_ID('[Security].[Permission]'))
    CREATE NONCLUSTERED INDEX IX_Security_Permission_RoleId ON [Security].[Permission](RoleId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_Permission_EndpointId' AND object_id = OBJECT_ID('[Security].[Permission]'))
    CREATE NONCLUSTERED INDEX IX_Security_Permission_EndpointId ON [Security].[Permission](EndpointId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_Permission_Active' AND object_id = OBJECT_ID('[Security].[Permission]'))
    CREATE NONCLUSTERED INDEX IX_Security_Permission_Active ON [Security].[Permission](Active);

-- [Security].[RoleUser]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_RoleUser_RoleId' AND object_id = OBJECT_ID('[Security].[RoleUser]'))
    CREATE NONCLUSTERED INDEX IX_Security_RoleUser_RoleId ON [Security].[RoleUser](RoleId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_RoleUser_UserId' AND object_id = OBJECT_ID('[Security].[RoleUser]'))
    CREATE NONCLUSTERED INDEX IX_Security_RoleUser_UserId ON [Security].[RoleUser]([UserId]);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_RoleUser_Active' AND object_id = OBJECT_ID('[Security].[RoleUser]'))
    CREATE NONCLUSTERED INDEX IX_Security_RoleUser_Active ON [Security].[RoleUser](Active);

-- [ClinicalHistory].[ClinicalHistory]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_ClinicalHistory_PatientId' AND object_id = OBJECT_ID('[ClinicalHistory].[ClinicalHistory]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_ClinicalHistory_PatientId ON [ClinicalHistory].[ClinicalHistory](PatientId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_ClinicalHistory_Active' AND object_id = OBJECT_ID('[ClinicalHistory].[ClinicalHistory]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_ClinicalHistory_Active ON [ClinicalHistory].[ClinicalHistory](Active);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_ClinicalHistory_CreatedAt' AND object_id = OBJECT_ID('[ClinicalHistory].[ClinicalHistory]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_ClinicalHistory_CreatedAt ON [ClinicalHistory].[ClinicalHistory](CreatedAt);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_ClinicalHistory_Psychologist' AND object_id = OBJECT_ID('[ClinicalHistory].[ClinicalHistory]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_ClinicalHistory_Psychologist ON [ClinicalHistory].[ClinicalHistory](Psychologist);

-- ClinicalHistory (junction/detail tables)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_Religion_ClinicalHistoryId' AND object_id = OBJECT_ID('[ClinicalHistory].[Religion]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_Religion_ClinicalHistoryId ON [ClinicalHistory].[Religion](ClinicalHistoryId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_Religion_Active' AND object_id = OBJECT_ID('[ClinicalHistory].[Religion]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_Religion_Active ON [ClinicalHistory].[Religion](Active);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_MaritalStatus_ClinicalHistoryId' AND object_id = OBJECT_ID('[ClinicalHistory].[MaritalStatus]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_MaritalStatus_ClinicalHistoryId ON [ClinicalHistory].[MaritalStatus](ClinicalHistoryId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_MaritalStatus_Active' AND object_id = OBJECT_ID('[ClinicalHistory].[MaritalStatus]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_MaritalStatus_Active ON [ClinicalHistory].[MaritalStatus](Active);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_Occupation_ClinicalHistoryId' AND object_id = OBJECT_ID('[ClinicalHistory].[Occupation]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_Occupation_ClinicalHistoryId ON [ClinicalHistory].[Occupation](ClinicalHistoryId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_Occupation_Active' AND object_id = OBJECT_ID('[ClinicalHistory].[Occupation]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_Occupation_Active ON [ClinicalHistory].[Occupation](Active);



-- [Tracking].[TrackingSheet]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TrackingSheet_PatientId' AND object_id = OBJECT_ID('[Tracking].[TrackingSheet]'))
    CREATE NONCLUSTERED INDEX IX_Tracking_TrackingSheet_PatientId ON [Tracking].[TrackingSheet](PatientId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TrackingSheet_TaskId' AND object_id = OBJECT_ID('[Tracking].[TrackingSheet]'))
    CREATE NONCLUSTERED INDEX IX_Tracking_TrackingSheet_TaskId ON [Tracking].[TrackingSheet](TaskId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TrackingSheet_Completed' AND object_id = OBJECT_ID('[Tracking].[TrackingSheet]'))
    CREATE NONCLUSTERED INDEX IX_Tracking_TrackingSheet_Completed ON [Tracking].[TrackingSheet](Completed);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TrackingSheet_SessionDate' AND object_id = OBJECT_ID('[Tracking].[TrackingSheet]'))
    CREATE NONCLUSTERED INDEX IX_Tracking_TrackingSheet_SessionDate ON [Tracking].[TrackingSheet](SessionDate);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TrackingSheet_CreatedAt' AND object_id = OBJECT_ID('[Tracking].[TrackingSheet]'))
    CREATE NONCLUSTERED INDEX IX_Tracking_TrackingSheet_CreatedAt ON [Tracking].[TrackingSheet](CreatedAt);

-- [Tracking].[TaskAnswer]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TaskAnswer_TaskTrackingId' AND object_id = OBJECT_ID('[Tracking].[TaskAnswer]'))
    CREATE NONCLUSTERED INDEX IX_Tracking_TaskAnswer_TaskTrackingId ON [Tracking].[TaskAnswer](TaskTrackingId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TaskAnswer_CreatedAt' AND object_id = OBJECT_ID('[Tracking].[TaskAnswer]'))
    CREATE NONCLUSTERED INDEX IX_Tracking_TaskAnswer_CreatedAt ON [Tracking].[TaskAnswer](CreatedAt);

-- Tracking.Comment
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_Comment_TaskTrackingId' AND object_id = OBJECT_ID('Tracking.Comment'))
    CREATE NONCLUSTERED INDEX IX_Tracking_Comment_TaskTrackingId ON [Tracking].[Comment](TaskTrackingId);

-- [Tracking].[Answer]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_Answer_CommentId' AND object_id = OBJECT_ID('[Tracking].[Answer]'))
    CREATE NONCLUSTERED INDEX IX_Tracking_Answer_CommentId ON [Tracking].[Answer](CommentId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_Answer_CreatedAt' AND object_id = OBJECT_ID('[Tracking].[Answer]'))
    CREATE NONCLUSTERED INDEX IX_Tracking_Answer_CreatedAt ON [Tracking].[Answer](CreatedAt);

-- [Tracking].[TaskAnswerDocument]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TaskAnswerDocument_DocumentId' AND object_id = OBJECT_ID('[Tracking].[TaskAnswerDocument]'))
    CREATE NONCLUSTERED INDEX IX_Tracking_TaskAnswerDocument_DocumentId ON [Tracking].[TaskAnswerDocument](DocumentId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TaskAnswerDocument_TaskAnswerId' AND object_id = OBJECT_ID('[Tracking].[TaskAnswerDocument]'))
    CREATE NONCLUSTERED INDEX IX_Tracking_TaskAnswerDocument_TaskAnswerId ON [Tracking].[TaskAnswerDocument](TaskAnswerId);

-- [Report].[PsychologicalReport]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Report_PsychologicalReport_PatientId' AND object_id = OBJECT_ID('[Report].[PsychologicalReport]'))
    CREATE NONCLUSTERED INDEX IX_Report_PsychologicalReport_PatientId ON [Report].[PsychologicalReport](PatientId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Report_PsychologicalReport_PsychologistId' AND object_id = OBJECT_ID('[Report].[PsychologicalReport]'))
    CREATE NONCLUSTERED INDEX IX_Report_PsychologicalReport_PsychologistId ON [Report].[PsychologicalReport](PsychologistId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Report_PsychologicalReport_Completed' AND object_id = OBJECT_ID('[Report].[PsychologicalReport]'))
    CREATE NONCLUSTERED INDEX IX_Report_PsychologicalReport_Completed ON [Report].[PsychologicalReport](Completed);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Report_PsychologicalReport_CreatedAt' AND object_id = OBJECT_ID('[Report].[PsychologicalReport]'))
    CREATE NONCLUSTERED INDEX IX_Report_PsychologicalReport_CreatedAt ON [Report].[PsychologicalReport](CreatedAt);

-- General (catálogos por Name para búsqueda)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_General_Religion_Name' AND object_id = OBJECT_ID('[General].[Religion]'))
    CREATE NONCLUSTERED INDEX IX_General_Religion_Name ON [General].[Religion](Name);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_General_MaritalStatus_Name' AND object_id = OBJECT_ID('[General].[MaritalStatus]'))
    CREATE NONCLUSTERED INDEX IX_General_MaritalStatus_Name ON [General].[MaritalStatus](Name);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_General_Occupation_Name' AND object_id = OBJECT_ID('[General].[Occupation]'))
    CREATE NONCLUSTERED INDEX IX_General_Occupation_Name ON [General].[Occupation](Name);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_General_TherapyType_Name' AND object_id = OBJECT_ID('[General].[TherapyType]'))
    CREATE NONCLUSTERED INDEX IX_General_TherapyType_Name ON [General].[TherapyType](Name);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_General_Emotion_Name' AND object_id = OBJECT_ID('[General].[Emotion]'))
    CREATE NONCLUSTERED INDEX IX_General_Emotion_Name ON [General].[Emotion](Name);

-- [Person].[Gender], [ClinicalHistory].[PatientStatus]
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_Gender_Name' AND object_id = OBJECT_ID('[Person].[Gender]'))
    CREATE NONCLUSTERED INDEX IX_Person_Gender_Name ON [Person].[Gender](Name);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_PatientStatus_Name' AND object_id = OBJECT_ID('[ClinicalHistory].[PatientStatus]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_PatientStatus_Name ON [ClinicalHistory].[PatientStatus](Name);

-- Security (catálogos por Name)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_Action_Name' AND object_id = OBJECT_ID('Security.Action'))
    CREATE NONCLUSTERED INDEX IX_Security_Action_Name ON [Security].[Action](Name);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_Endpoint_Name' AND object_id = OBJECT_ID('[Security].[Endpoint]'))
    CREATE NONCLUSTERED INDEX IX_Security_Endpoint_Name ON [Security].[Endpoint](Name);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_Endpoint_ActionId' AND object_id = OBJECT_ID('[Security].[Endpoint]'))
    CREATE NONCLUSTERED INDEX IX_Security_Endpoint_ActionId ON [Security].[Endpoint](ActionId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_Role_Name' AND object_id = OBJECT_ID('Security.Role'))
    CREATE NONCLUSTERED INDEX IX_Security_Role_Name ON [Security].[Role](Name);

-- [Person].[PatientTherapyType] (UX ya cubre PatientId+TherapyTypeId; TherapyTypeId solo para filtros por tipo)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_PatientTherapyType_TherapyTypeId' AND object_id = OBJECT_ID('[Person].[PatientTherapyType]'))
    CREATE NONCLUSTERED INDEX IX_Person_PatientTherapyType_TherapyTypeId ON [Person].[PatientTherapyType](TherapyTypeId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_PatientTherapyType_CreatedAt' AND object_id = OBJECT_ID('[Person].[PatientTherapyType]'))
    CREATE NONCLUSTERED INDEX IX_Person_PatientTherapyType_CreatedAt ON [Person].[PatientTherapyType](CreatedAt);

-- [Resource].[Document] (junction recurso ↔ documento)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_Document_ResourceId' AND object_id = OBJECT_ID('[Resource].[Document]'))
    CREATE NONCLUSTERED INDEX IX_Resource_Document_ResourceId ON [Resource].[Document](ResourceId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_Document_DocumentId' AND object_id = OBJECT_ID('[Resource].[Document]'))
    CREATE NONCLUSTERED INDEX IX_Resource_Document_DocumentId ON [Resource].[Document](DocumentId);

-- [Tracking].[TaskTrackingSheet] (FK; alineado con EF IX_TaskTrackingSheet_TrackingSheetId)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_TaskTrackingSheet_TrackingSheetId' AND object_id = OBJECT_ID('[Tracking].[TaskTrackingSheet]'))
    CREATE NONCLUSTERED INDEX IX_TaskTrackingSheet_TrackingSheetId ON [Tracking].[TaskTrackingSheet](TrackingSheetId);

-- [Tracking].[TrackingSheet] filtros adicionales usados en API
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TrackingSheet_CreatedBy' AND object_id = OBJECT_ID('[Tracking].[TrackingSheet]'))
    CREATE NONCLUSTERED INDEX IX_Tracking_TrackingSheet_CreatedBy ON [Tracking].[TrackingSheet](CreatedBy);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TrackingSheet_UpdatedBy' AND object_id = OBJECT_ID('[Tracking].[TrackingSheet]'))
    CREATE NONCLUSTERED INDEX IX_Tracking_TrackingSheet_UpdatedBy ON [Tracking].[TrackingSheet](UpdatedBy);

-- [CognitiveBehavioralTherapy].[Record] (listados por paciente/fecha; filtros por CreatedAt)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_CBT_Record_PatientId_EventDate' AND object_id = OBJECT_ID('[CognitiveBehavioralTherapy].[Record]'))
    CREATE NONCLUSTERED INDEX IX_CBT_Record_PatientId_EventDate ON [CognitiveBehavioralTherapy].[Record](PatientId, EventDate DESC);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_CBT_Record_EventDate' AND object_id = OBJECT_ID('[CognitiveBehavioralTherapy].[Record]'))
    CREATE NONCLUSTERED INDEX IX_CBT_Record_EventDate ON [CognitiveBehavioralTherapy].[Record](EventDate);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_CBT_Record_CreatedAt' AND object_id = OBJECT_ID('[CognitiveBehavioralTherapy].[Record]'))
    CREATE NONCLUSTERED INDEX IX_CBT_Record_CreatedAt ON [CognitiveBehavioralTherapy].[Record](CreatedAt);

-- [CognitiveBehavioralTherapy].[RecordEmotion] (borrado en cascada por RecordId; filtros por emoción y fecha)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_CBT_RecordEmotion_RecordId' AND object_id = OBJECT_ID('[CognitiveBehavioralTherapy].[RecordEmotion]'))
    CREATE NONCLUSTERED INDEX IX_CBT_RecordEmotion_RecordId ON [CognitiveBehavioralTherapy].[RecordEmotion](RecordId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_CBT_RecordEmotion_EmotionId' AND object_id = OBJECT_ID('[CognitiveBehavioralTherapy].[RecordEmotion]'))
    CREATE NONCLUSTERED INDEX IX_CBT_RecordEmotion_EmotionId ON [CognitiveBehavioralTherapy].[RecordEmotion](EmotionId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_CBT_RecordEmotion_CreatedAt' AND object_id = OBJECT_ID('[CognitiveBehavioralTherapy].[RecordEmotion]'))
    CREATE NONCLUSTERED INDEX IX_CBT_RecordEmotion_CreatedAt ON [CognitiveBehavioralTherapy].[RecordEmotion](CreatedAt);

PRINT 'Sidae Data Model indexes created successfully.';

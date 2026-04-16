-- =============================================
-- Migration Down: Drop Sidae Data Model indexes
-- =============================================

-- Person.Person
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_Person_LastName_FirstName' AND object_id = OBJECT_ID('Person.Person'))
    DROP INDEX IX_Person_Person_LastName_FirstName ON [Person].[Person];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_Person_CreatedAt' AND object_id = OBJECT_ID('Person.Person'))
    DROP INDEX IX_Person_Person_CreatedAt ON [Person].[Person];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_Person_GenderId' AND object_id = OBJECT_ID('Person.Person'))
    DROP INDEX IX_Person_Person_GenderId ON [Person].[Person];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_Person_IdentityNumber' AND object_id = OBJECT_ID('[Person].[Person]'))
    DROP INDEX IX_Person_Person_IdentityNumber ON [Person].[Person];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_Person_Email' AND object_id = OBJECT_ID('Person.Person'))
    DROP INDEX IX_Person_Person_Email ON [Person].[Person];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_Person_Active' AND object_id = OBJECT_ID('Person.Person'))
    DROP INDEX IX_Person_Person_Active ON [Person].[Person];

-- Person.Gender
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_Gender_Name' AND object_id = OBJECT_ID('Person.Gender'))
    DROP INDEX IX_Person_Gender_Name ON [Person].[Gender];

-- Task.[Group]
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Group_PsychologistId' AND object_id = OBJECT_ID('Task.Group'))
    DROP INDEX IX_Task_Group_PsychologistId ON [Task].[Group];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Group_Name' AND object_id = OBJECT_ID('Task.Group'))
    DROP INDEX IX_Task_Group_Name ON [Task].[Group];

-- Task.Task
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Task_Active' AND object_id = OBJECT_ID('Task.Task'))
    DROP INDEX IX_Task_Task_Active ON [Task].[Task];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Task_PsychologistId' AND object_id = OBJECT_ID('Task.Task'))
    DROP INDEX IX_Task_Task_PsychologistId ON [Task].[Task];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Task_CreatedBy' AND object_id = OBJECT_ID('Task.Task'))
    DROP INDEX IX_Task_Task_CreatedBy ON [Task].[Task];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Task_CreatedAt' AND object_id = OBJECT_ID('Task.Task'))
    DROP INDEX IX_Task_Task_CreatedAt ON [Task].[Task];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Task_Name' AND object_id = OBJECT_ID('Task.Task'))
    DROP INDEX IX_Task_Task_Name ON [Task].[Task];

-- Task.GroupAssignment
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_GroupAssignment_Active' AND object_id = OBJECT_ID('Task.GroupAssignment'))
    DROP INDEX IX_Task_GroupAssignment_Active ON [Task].[GroupAssignment];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_GroupAssignment_TaskGroupId' AND object_id = OBJECT_ID('Task.GroupAssignment'))
    DROP INDEX IX_Task_GroupAssignment_TaskGroupId ON [Task].[GroupAssignment];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_GroupAssignment_TaskId' AND object_id = OBJECT_ID('Task.GroupAssignment'))
    DROP INDEX IX_Task_GroupAssignment_TaskId ON [Task].[GroupAssignment];

-- Task.Document
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Document_DocumentId' AND object_id = OBJECT_ID('Task.Document'))
    DROP INDEX IX_Task_Document_DocumentId ON [Task].[Document];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Task_Document_TaskId' AND object_id = OBJECT_ID('Task.Document'))
    DROP INDEX IX_Task_Document_TaskId ON [Task].[Document];

-- Document.MimeType
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Document_MimeType_Name' AND object_id = OBJECT_ID('Document.MimeType'))
    DROP INDEX IX_Document_MimeType_Name ON [Document].[MimeType];

-- Document.Document
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Document_Document_Name' AND object_id = OBJECT_ID('Document.Document'))
    DROP INDEX IX_Document_Document_Name ON [Document].[Document];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Document_Document_CreatedAt' AND object_id = OBJECT_ID('Document.Document'))
    DROP INDEX IX_Document_Document_CreatedAt ON [Document].[Document];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Document_Document_Active' AND object_id = OBJECT_ID('Document.Document'))
    DROP INDEX IX_Document_Document_Active ON [Document].[Document];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Document_Document_FolderId' AND object_id = OBJECT_ID('Document.Document'))
    DROP INDEX IX_Document_Document_FolderId ON [Document].[Document];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Document_Document_MimeTypeId' AND object_id = OBJECT_ID('Document.Document'))
    DROP INDEX IX_Document_Document_MimeTypeId ON [Document].[Document];

-- Resource.Resource
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_Resource_Name' AND object_id = OBJECT_ID('Resource.Resource'))
    DROP INDEX IX_Resource_Resource_Name ON [Resource].[Resource];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_Resource_PsychologistId' AND object_id = OBJECT_ID('Resource.Resource'))
    DROP INDEX IX_Resource_Resource_PsychologistId ON [Resource].[Resource];

-- Resource.[Group]
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_Group_Name' AND object_id = OBJECT_ID('Resource.Group'))
    DROP INDEX IX_Resource_Group_Name ON [Resource].[Group];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_Group_PsychologistId' AND object_id = OBJECT_ID('Resource.Group'))
    DROP INDEX IX_Resource_Group_PsychologistId ON [Resource].[Group];

-- Resource.GroupAssignment
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_GroupAssignment_Active' AND object_id = OBJECT_ID('Resource.GroupAssignment'))
    DROP INDEX IX_Resource_GroupAssignment_Active ON [Resource].[GroupAssignment];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_GroupAssignment_ResourceGroupId' AND object_id = OBJECT_ID('Resource.GroupAssignment'))
    DROP INDEX IX_Resource_GroupAssignment_ResourceGroupId ON [Resource].[GroupAssignment];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_GroupAssignment_ResourceId' AND object_id = OBJECT_ID('Resource.GroupAssignment'))
    DROP INDEX IX_Resource_GroupAssignment_ResourceId ON [Resource].[GroupAssignment];

-- Resource.PatientAssignment
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_PatientAssignment_Active' AND object_id = OBJECT_ID('Resource.PatientAssignment'))
    DROP INDEX IX_Resource_PatientAssignment_Active ON [Resource].[PatientAssignment];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_PatientAssignment_PatientId' AND object_id = OBJECT_ID('Resource.PatientAssignment'))
    DROP INDEX IX_Resource_PatientAssignment_PatientId ON [Resource].[PatientAssignment];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_PatientAssignment_ResourceId' AND object_id = OBJECT_ID('Resource.PatientAssignment'))
    DROP INDEX IX_Resource_PatientAssignment_ResourceId ON [Resource].[PatientAssignment];

-- Security.Permission
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_Permission_Active' AND object_id = OBJECT_ID('Security.Permission'))
    DROP INDEX IX_Security_Permission_Active ON [Security].[Permission];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_Permission_EndpointId' AND object_id = OBJECT_ID('Security.Permission'))
    DROP INDEX IX_Security_Permission_EndpointId ON [Security].[Permission];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_Permission_RoleId' AND object_id = OBJECT_ID('Security.Permission'))
    DROP INDEX IX_Security_Permission_RoleId ON [Security].[Permission];

-- Security.RoleUser
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_RoleUser_Active' AND object_id = OBJECT_ID('Security.RoleUser'))
    DROP INDEX IX_Security_RoleUser_Active ON [Security].[RoleUser];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_RoleUser_UserId' AND object_id = OBJECT_ID('Security.RoleUser'))
    DROP INDEX IX_Security_RoleUser_UserId ON [Security].[RoleUser];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_RoleUser_RoleId' AND object_id = OBJECT_ID('Security.RoleUser'))
    DROP INDEX IX_Security_RoleUser_RoleId ON [Security].[RoleUser];

-- Security (catálogos)
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_Role_Name' AND object_id = OBJECT_ID('Security.Role'))
    DROP INDEX IX_Security_Role_Name ON [Security].[Role];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_Endpoint_Name' AND object_id = OBJECT_ID('Security.Endpoint'))
    DROP INDEX IX_Security_Endpoint_Name ON [Security].[Endpoint];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_Action_Name' AND object_id = OBJECT_ID('Security.Action'))
    DROP INDEX IX_Security_Action_Name ON [Security].[Action];

-- ClinicalHistory.ClinicalHistory
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_ClinicalHistory_Psychologist' AND object_id = OBJECT_ID('ClinicalHistory.ClinicalHistory'))
    DROP INDEX IX_ClinicalHistory_ClinicalHistory_Psychologist ON [ClinicalHistory].[ClinicalHistory];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_ClinicalHistory_CreatedAt' AND object_id = OBJECT_ID('ClinicalHistory.ClinicalHistory'))
    DROP INDEX IX_ClinicalHistory_ClinicalHistory_CreatedAt ON [ClinicalHistory].[ClinicalHistory];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_ClinicalHistory_Active' AND object_id = OBJECT_ID('ClinicalHistory.ClinicalHistory'))
    DROP INDEX IX_ClinicalHistory_ClinicalHistory_Active ON [ClinicalHistory].[ClinicalHistory];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_ClinicalHistory_PatientId' AND object_id = OBJECT_ID('ClinicalHistory.ClinicalHistory'))
    DROP INDEX IX_ClinicalHistory_ClinicalHistory_PatientId ON [ClinicalHistory].[ClinicalHistory];

-- ClinicalHistory.PatientStatus
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_PatientStatus_Name' AND object_id = OBJECT_ID('ClinicalHistory.PatientStatus'))
    DROP INDEX IX_ClinicalHistory_PatientStatus_Name ON [ClinicalHistory].[PatientStatus];

-- ClinicalHistory (junction/detail)
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_Religion_Active' AND object_id = OBJECT_ID('ClinicalHistory.Religion'))
    DROP INDEX IX_ClinicalHistory_Religion_Active ON [ClinicalHistory].[Religion];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_Religion_ClinicalHistoryId' AND object_id = OBJECT_ID('ClinicalHistory.Religion'))
    DROP INDEX IX_ClinicalHistory_Religion_ClinicalHistoryId ON [ClinicalHistory].[Religion];

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_MaritalStatus_Active' AND object_id = OBJECT_ID('ClinicalHistory.MaritalStatus'))
    DROP INDEX IX_ClinicalHistory_MaritalStatus_Active ON [ClinicalHistory].[MaritalStatus];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_MaritalStatus_ClinicalHistoryId' AND object_id = OBJECT_ID('ClinicalHistory.MaritalStatus'))
    DROP INDEX IX_ClinicalHistory_MaritalStatus_ClinicalHistoryId ON [ClinicalHistory].[MaritalStatus];

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_Occupation_Active' AND object_id = OBJECT_ID('ClinicalHistory.Occupation'))
    DROP INDEX IX_ClinicalHistory_Occupation_Active ON [ClinicalHistory].[Occupation];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_Occupation_ClinicalHistoryId' AND object_id = OBJECT_ID('ClinicalHistory.Occupation'))
    DROP INDEX IX_ClinicalHistory_Occupation_ClinicalHistoryId ON [ClinicalHistory].[Occupation];



-- Tracking.TrackingSheet
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TrackingSheet_CreatedAt' AND object_id = OBJECT_ID('Tracking.TrackingSheet'))
    DROP INDEX IX_Tracking_TrackingSheet_CreatedAt ON [Tracking].[TrackingSheet];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TrackingSheet_SessionDate' AND object_id = OBJECT_ID('Tracking.TrackingSheet'))
    DROP INDEX IX_Tracking_TrackingSheet_SessionDate ON [Tracking].[TrackingSheet];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TrackingSheet_Completed' AND object_id = OBJECT_ID('Tracking.TrackingSheet'))
    DROP INDEX IX_Tracking_TrackingSheet_Completed ON [Tracking].[TrackingSheet];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TrackingSheet_TaskId' AND object_id = OBJECT_ID('Tracking.TrackingSheet'))
    DROP INDEX IX_Tracking_TrackingSheet_TaskId ON [Tracking].[TrackingSheet];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TrackingSheet_PatientId' AND object_id = OBJECT_ID('Tracking.TrackingSheet'))
    DROP INDEX IX_Tracking_TrackingSheet_PatientId ON [Tracking].[TrackingSheet];

-- Tracking.TaskAnswer
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TaskAnswer_CreatedAt' AND object_id = OBJECT_ID('Tracking.TaskAnswer'))
    DROP INDEX IX_Tracking_TaskAnswer_CreatedAt ON [Tracking].[TaskAnswer];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TaskAnswer_TaskTrackingId' AND object_id = OBJECT_ID('Tracking.TaskAnswer'))
    DROP INDEX IX_Tracking_TaskAnswer_TaskTrackingId ON [Tracking].[TaskAnswer];

-- Tracking.Comment
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_Comment_TaskTrackingId' AND object_id = OBJECT_ID('Tracking.Comment'))
    DROP INDEX IX_Tracking_Comment_TaskTrackingId ON [Tracking].[Comment];

-- Tracking.Answer
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_Answer_CreatedAt' AND object_id = OBJECT_ID('Tracking.Answer'))
    DROP INDEX IX_Tracking_Answer_CreatedAt ON [Tracking].[Answer];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_Answer_CommentId' AND object_id = OBJECT_ID('Tracking.Answer'))
    DROP INDEX IX_Tracking_Answer_CommentId ON [Tracking].[Answer];

-- Tracking.TaskAnswerDocument
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TaskAnswerDocument_TaskAnswerId' AND object_id = OBJECT_ID('Tracking.TaskAnswerDocument'))
    DROP INDEX IX_Tracking_TaskAnswerDocument_TaskAnswerId ON [Tracking].[TaskAnswerDocument];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TaskAnswerDocument_DocumentId' AND object_id = OBJECT_ID('Tracking.TaskAnswerDocument'))
    DROP INDEX IX_Tracking_TaskAnswerDocument_DocumentId ON [Tracking].[TaskAnswerDocument];

-- Report.PsychologicalReport
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Report_PsychologicalReport_CreatedAt' AND object_id = OBJECT_ID('Report.PsychologicalReport'))
    DROP INDEX IX_Report_PsychologicalReport_CreatedAt ON [Report].[PsychologicalReport];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Report_PsychologicalReport_Completed' AND object_id = OBJECT_ID('Report.PsychologicalReport'))
    DROP INDEX IX_Report_PsychologicalReport_Completed ON [Report].[PsychologicalReport];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Report_PsychologicalReport_PsychologistId' AND object_id = OBJECT_ID('Report.PsychologicalReport'))
    DROP INDEX IX_Report_PsychologicalReport_PsychologistId ON [Report].[PsychologicalReport];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Report_PsychologicalReport_PatientId' AND object_id = OBJECT_ID('Report.PsychologicalReport'))
    DROP INDEX IX_Report_PsychologicalReport_PatientId ON [Report].[PsychologicalReport];

-- General
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_General_Occupation_Name' AND object_id = OBJECT_ID('General.Occupation'))
    DROP INDEX IX_General_Occupation_Name ON [General].[Occupation];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_General_MaritalStatus_Name' AND object_id = OBJECT_ID('General.MaritalStatus'))
    DROP INDEX IX_General_MaritalStatus_Name ON [General].[MaritalStatus];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_General_Religion_Name' AND object_id = OBJECT_ID('General.Religion'))
    DROP INDEX IX_General_Religion_Name ON [General].[Religion];

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_General_Emotion_Name' AND object_id = OBJECT_ID('[General].[Emotion]'))
    DROP INDEX IX_General_Emotion_Name ON [General].[Emotion];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_General_TherapyType_Name' AND object_id = OBJECT_ID('[General].[TherapyType]'))
    DROP INDEX IX_General_TherapyType_Name ON [General].[TherapyType];

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Security_Endpoint_ActionId' AND object_id = OBJECT_ID('[Security].[Endpoint]'))
    DROP INDEX IX_Security_Endpoint_ActionId ON [Security].[Endpoint];

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_PatientTherapyType_CreatedAt' AND object_id = OBJECT_ID('[Person].[PatientTherapyType]'))
    DROP INDEX IX_Person_PatientTherapyType_CreatedAt ON [Person].[PatientTherapyType];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Person_PatientTherapyType_TherapyTypeId' AND object_id = OBJECT_ID('[Person].[PatientTherapyType]'))
    DROP INDEX IX_Person_PatientTherapyType_TherapyTypeId ON [Person].[PatientTherapyType];

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_Document_DocumentId' AND object_id = OBJECT_ID('[Resource].[Document]'))
    DROP INDEX IX_Resource_Document_DocumentId ON [Resource].[Document];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Resource_Document_ResourceId' AND object_id = OBJECT_ID('[Resource].[Document]'))
    DROP INDEX IX_Resource_Document_ResourceId ON [Resource].[Document];

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_TaskTrackingSheet_TrackingSheetId' AND object_id = OBJECT_ID('[Tracking].[TaskTrackingSheet]'))
    DROP INDEX IX_TaskTrackingSheet_TrackingSheetId ON [Tracking].[TaskTrackingSheet];

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TrackingSheet_UpdatedBy' AND object_id = OBJECT_ID('[Tracking].[TrackingSheet]'))
    DROP INDEX IX_Tracking_TrackingSheet_UpdatedBy ON [Tracking].[TrackingSheet];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tracking_TrackingSheet_CreatedBy' AND object_id = OBJECT_ID('[Tracking].[TrackingSheet]'))
    DROP INDEX IX_Tracking_TrackingSheet_CreatedBy ON [Tracking].[TrackingSheet];

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_CBT_RecordEmotion_CreatedAt' AND object_id = OBJECT_ID('[CognitiveBehavioralTherapy].[RecordEmotion]'))
    DROP INDEX IX_CBT_RecordEmotion_CreatedAt ON [CognitiveBehavioralTherapy].[RecordEmotion];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_CBT_RecordEmotion_EmotionId' AND object_id = OBJECT_ID('[CognitiveBehavioralTherapy].[RecordEmotion]'))
    DROP INDEX IX_CBT_RecordEmotion_EmotionId ON [CognitiveBehavioralTherapy].[RecordEmotion];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_CBT_RecordEmotion_RecordId' AND object_id = OBJECT_ID('[CognitiveBehavioralTherapy].[RecordEmotion]'))
    DROP INDEX IX_CBT_RecordEmotion_RecordId ON [CognitiveBehavioralTherapy].[RecordEmotion];

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_CBT_Record_CreatedAt' AND object_id = OBJECT_ID('[CognitiveBehavioralTherapy].[Record]'))
    DROP INDEX IX_CBT_Record_CreatedAt ON [CognitiveBehavioralTherapy].[Record];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_CBT_Record_EventDate' AND object_id = OBJECT_ID('[CognitiveBehavioralTherapy].[Record]'))
    DROP INDEX IX_CBT_Record_EventDate ON [CognitiveBehavioralTherapy].[Record];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_CBT_Record_PatientId_EventDate' AND object_id = OBJECT_ID('[CognitiveBehavioralTherapy].[Record]'))
    DROP INDEX IX_CBT_Record_PatientId_EventDate ON [CognitiveBehavioralTherapy].[Record];

PRINT 'Sidae Data Model indexes dropped successfully.';

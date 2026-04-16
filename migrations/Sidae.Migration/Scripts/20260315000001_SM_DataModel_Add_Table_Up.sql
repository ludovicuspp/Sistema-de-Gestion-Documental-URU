-- =============================================
-- Migration: Create Sidae Data Model Tables
-- =============================================
-- Creates all tables from the ERD: Task, Person, Tracking, Security,
-- General, ClinicalHistory, Resource, Document, Report,
-- CognitiveBehavioralTherapy (+ General.TherapyType, General.Emotion, Person.PatientTherapyType)

-- =============================================
-- SCHEMA CREATION
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Task')
BEGIN EXEC('CREATE SCHEMA Task'); END
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Person')
BEGIN EXEC('CREATE SCHEMA Person'); END
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Tracking')
BEGIN EXEC('CREATE SCHEMA Tracking'); END
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Security')
BEGIN EXEC('CREATE SCHEMA Security'); END
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'General')
BEGIN EXEC('CREATE SCHEMA General'); END
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'ClinicalHistory')
BEGIN EXEC('CREATE SCHEMA ClinicalHistory'); END
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Resource')
BEGIN EXEC('CREATE SCHEMA Resource'); END
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Document')
BEGIN EXEC('CREATE SCHEMA Document'); END
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Report')
BEGIN EXEC('CREATE SCHEMA Report'); END
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'CognitiveBehavioralTherapy')
BEGIN EXEC('CREATE SCHEMA CognitiveBehavioralTherapy'); END

-- =============================================
-- TABLES WITHOUT FK (or only self/reference)
-- =============================================

-- [Person].[Gender]
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Gender' AND schema_id = SCHEMA_ID('Person'))
BEGIN
    CREATE TABLE [Person].[Gender] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Person_Gender_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Person_Gender_GuidId UNIQUE (GuidId),
        Name NVARCHAR(25) NOT NULL
    );
END

-- [General].[Religion], MaritalStatus, Occupation
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Religion' AND schema_id = SCHEMA_ID('General'))
BEGIN
    CREATE TABLE [General].[Religion] ( ID INT IDENTITY(1,1) PRIMARY KEY, GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_General_Religion_GuidId DEFAULT NEWSEQUENTIALID(), CONSTRAINT UQ_General_Religion_GuidId UNIQUE (GuidId), Name NVARCHAR(25) NOT NULL );
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MaritalStatus' AND schema_id = SCHEMA_ID('General'))
BEGIN
    CREATE TABLE [General].[MaritalStatus] ( ID INT IDENTITY(1,1) PRIMARY KEY, GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_General_MaritalStatus_GuidId DEFAULT NEWSEQUENTIALID(), CONSTRAINT UQ_General_MaritalStatus_GuidId UNIQUE (GuidId), Name NVARCHAR(25) NOT NULL );
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Occupation' AND schema_id = SCHEMA_ID('General'))
BEGIN
    CREATE TABLE [General].[Occupation] ( ID INT IDENTITY(1,1) PRIMARY KEY, GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_General_Occupation_GuidId DEFAULT NEWSEQUENTIALID(), CONSTRAINT UQ_General_Occupation_GuidId UNIQUE (GuidId), Name NVARCHAR(60) NOT NULL );
END

-- [General].[TherapyType], [General].[Emotion] (catálogos TCC / emociones; sin columnas de auditoría, alineado a General.Religion)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TherapyType' AND schema_id = SCHEMA_ID('General'))
BEGIN
    CREATE TABLE [General].[TherapyType] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_General_TherapyType_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_General_TherapyType_GuidId UNIQUE (GuidId),
        Name NVARCHAR(25) NOT NULL
    );
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Emotion' AND schema_id = SCHEMA_ID('General'))
BEGIN
    CREATE TABLE [General].[Emotion] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_General_Emotion_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_General_Emotion_GuidId UNIQUE (GuidId),
        Name NVARCHAR(25) NOT NULL
    );
END

-- Security.Action, Endpoint, Role (Action y Role son palabras reservadas; se usan corchetes)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Action' AND schema_id = SCHEMA_ID('Security'))
BEGIN
    CREATE TABLE [Security].[Action] ( ID INT IDENTITY(1,1) PRIMARY KEY, GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Security_Action_GuidId DEFAULT NEWSEQUENTIALID(), CONSTRAINT UQ_Security_Action_GuidId UNIQUE (GuidId), Name NVARCHAR(30) NOT NULL );
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Endpoint' AND schema_id = SCHEMA_ID('Security'))
BEGIN
    CREATE TABLE [Security].[Endpoint] ( ID INT IDENTITY(1,1) PRIMARY KEY, GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Security_Endpoint_GuidId DEFAULT NEWSEQUENTIALID(), CONSTRAINT UQ_Security_Endpoint_GuidId UNIQUE (GuidId), Name NVARCHAR(300) NOT NULL, ActionId INT NOT NULL, CONSTRAINT FK_Security_Endpoint_Action FOREIGN KEY (ActionId) REFERENCES [Security].[Action](ID) );
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Role' AND schema_id = SCHEMA_ID('Security'))
BEGIN
    CREATE TABLE [Security].[Role] ( ID INT IDENTITY(1,1) PRIMARY KEY, GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Security_Role_GuidId DEFAULT NEWSEQUENTIALID(), CONSTRAINT UQ_Security_Role_GuidId UNIQUE (GuidId), Name NVARCHAR(30) NOT NULL );
END

-- [Document].[MimeType]
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MimeType' AND schema_id = SCHEMA_ID('Document'))
BEGIN
    CREATE TABLE [Document].[MimeType] ( ID INT IDENTITY(1,1) PRIMARY KEY, GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Document_MimeType_GuidId DEFAULT NEWSEQUENTIALID(), CONSTRAINT UQ_Document_MimeType_GuidId UNIQUE (GuidId), Name NVARCHAR(255) NOT NULL );
END

-- [ClinicalHistory].[PatientStatus]
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PatientStatus' AND schema_id = SCHEMA_ID('ClinicalHistory'))
BEGIN
    CREATE TABLE [ClinicalHistory].[PatientStatus] ( ID INT IDENTITY(1,1) PRIMARY KEY, GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_ClinicalHistory_PatientStatus_GuidId DEFAULT NEWSEQUENTIALID(), CONSTRAINT UQ_ClinicalHistory_PatientStatus_GuidId UNIQUE (GuidId), Name NVARCHAR(25) NOT NULL );
END

-- =============================================
-- [Person].[Person] (depends on [Person].[Gender])
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Person' AND schema_id = SCHEMA_ID('Person'))
BEGIN
    CREATE TABLE [Person].[Person] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Person_Person_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Person_Person_GuidId UNIQUE (GuidId),
        FirstName NVARCHAR(30) NOT NULL,
        LastName NVARCHAR(30) NOT NULL,
        IdentityNumber NVARCHAR(30) NULL,
        Email NVARCHAR(40) NULL,
        PhoneNumber NVARCHAR(30) NULL,
        BirthDate DATE NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        UpdatedAt DATETIME NULL,
        UpdatedBy INT NULL,
        Active BIT NOT NULL DEFAULT 1,
        GenderId INT NULL,
        ClerkUserId NVARCHAR(128) NULL,
        CpezNumber INT NULL,
        FpvNumber INT NULL,
        CONSTRAINT FK_Person_Gender FOREIGN KEY (GenderId) REFERENCES [Person].[Gender](ID),
        CONSTRAINT FK_Person_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_Person_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES [Person].[Person](ID)
    );
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_Person_ClerkUserId' AND object_id = OBJECT_ID(N'[Person].[Person]'))
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX UX_Person_ClerkUserId ON [Person].[Person](ClerkUserId) WHERE ClerkUserId IS NOT NULL;
END

-- [Person].[PatientTherapyType] — asignación paciente ↔ tipo de terapia (ERD Person: PatientId + TherapyTypeId)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PatientTherapyType' AND schema_id = SCHEMA_ID('Person'))
BEGIN
    CREATE TABLE [Person].[PatientTherapyType] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Person_PatientTherapyType_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Person_PatientTherapyType_GuidId UNIQUE (GuidId),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        UpdatedAt DATETIME NULL,
        UpdatedBy INT NULL,
        PatientId INT NOT NULL,
        TherapyTypeId INT NOT NULL,
        CONSTRAINT FK_PatientTherapyType_Patient FOREIGN KEY (PatientId) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_PatientTherapyType_TherapyType FOREIGN KEY (TherapyTypeId) REFERENCES [General].[TherapyType](ID),
        CONSTRAINT FK_PatientTherapyType_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_PatientTherapyType_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES [Person].[Person](ID)
    );
END
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_Person_PatientTherapyType_Patient_Therapy' AND object_id = OBJECT_ID(N'[Person].[PatientTherapyType]'))
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX UX_Person_PatientTherapyType_Patient_Therapy ON [Person].[PatientTherapyType](PatientId, TherapyTypeId);
END

-- =============================================
-- [Task].[Group] (depends on [Person].[Person])
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Group' AND schema_id = SCHEMA_ID('Task'))
BEGIN
    CREATE TABLE [Task].[Group] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Task_Group_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Task_Group_GuidId UNIQUE (GuidId),
        Name NVARCHAR(255) NOT NULL,
        Description NVARCHAR(255) NULL,
        PsychologistId INT NULL,
        CONSTRAINT FK_TaskGroup_Psychologist FOREIGN KEY (PsychologistId) REFERENCES [Person].[Person](ID)
    );
END

-- =============================================
-- [Task].[Task] (depends on Task.Group)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Task' AND schema_id = SCHEMA_ID('Task'))
BEGIN
    CREATE TABLE [Task].[Task] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Task_Task_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Task_Task_GuidId UNIQUE (GuidId),
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(255) NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        UpdatedAt DATETIME NULL,
        UpdatedBy INT NULL,
        Active BIT NOT NULL DEFAULT 1,
        PsychologistId INT NULL,
        CONSTRAINT FK_Task_Psychologist FOREIGN KEY (PsychologistId) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_Task_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_Task_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES [Person].[Person](ID)
    );
END

-- =============================================
-- [Document].[Document] (depends on [Document].[MimeType])
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Document' AND schema_id = SCHEMA_ID('Document'))
BEGIN
    CREATE TABLE [Document].[Document] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Document_Document_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Document_Document_GuidId UNIQUE (GuidId),
        Path NVARCHAR(400) NOT NULL,
        Name NVARCHAR(100) NOT NULL,
        Size BIGINT NULL,
        UploadedAt DATETIME NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        Active BIT NOT NULL DEFAULT 1,
        FolderId INT NULL,
        MimeTypeId INT NULL,
        CONSTRAINT FK_Document_MimeType FOREIGN KEY (MimeTypeId) REFERENCES [Document].[MimeType](ID),
        CONSTRAINT FK_Document_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID)
    );
END

-- =============================================
-- [Resource].[Resource], [Resource].[Group] (depend on [Person].[Person])
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Resource' AND schema_id = SCHEMA_ID('Resource'))
BEGIN
    CREATE TABLE [Resource].[Resource] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Resource_Resource_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Resource_Resource_GuidId UNIQUE (GuidId),
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(255) NULL,
        PsychologistId INT NULL,
        CONSTRAINT FK_Resource_Psychologist FOREIGN KEY (PsychologistId) REFERENCES [Person].[Person](ID)
    );
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Group' AND schema_id = SCHEMA_ID('Resource'))
BEGIN
    CREATE TABLE [Resource].[Group] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Resource_Group_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Resource_Group_GuidId UNIQUE (GuidId),
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(255) NULL,
        PsychologistId INT NULL,
        CONSTRAINT FK_ResourceGroup_Psychologist FOREIGN KEY (PsychologistId) REFERENCES [Person].[Person](ID)
    );
END

-- =============================================
-- [ClinicalHistory].[ClinicalHistory] (depends on [Person].[Person])
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ClinicalHistory' AND schema_id = SCHEMA_ID('ClinicalHistory'))
BEGIN
    CREATE TABLE [ClinicalHistory].[ClinicalHistory] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_ClinicalHistory_ClinicalHistory_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_ClinicalHistory_ClinicalHistory_GuidId UNIQUE (GuidId),
        Birthplace NVARCHAR(100) NULL,
        Address NVARCHAR(100) NULL,
        AcademicStudies NVARCHAR(100) NULL,
        ParentEstate NVARCHAR(100) NULL,
        Psychologist INT NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        UpdatedAt DATETIME NULL,
        UpdatedBy INT NULL,
        Active BIT NOT NULL DEFAULT 1,
        PatientId INT NULL,
        PatientStatusId INT NULL,
        CONSTRAINT FK_ClinicalHistory_Patient FOREIGN KEY (PatientId) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_ClinicalHistory_PatientStatus FOREIGN KEY (PatientStatusId) REFERENCES [ClinicalHistory].[PatientStatus](ID),
        CONSTRAINT FK_ClinicalHistory_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_ClinicalHistory_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES [Person].[Person](ID)
    );
END

-- =============================================
-- [Task].[GroupAssignment], [Task].[Document] (depend on [Task].[Task], [Resource].[Resource], [Document].[Document])
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GroupAssignment' AND schema_id = SCHEMA_ID('Task'))
BEGIN
    CREATE TABLE [Task].[GroupAssignment] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Task_GroupAssignment_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Task_GroupAssignment_GuidId UNIQUE (GuidId),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        Active BIT NOT NULL DEFAULT 1,
        TaskId INT NOT NULL,
        TaskGroupId INT NOT NULL,
        CONSTRAINT FK_TaskGroupAssignment_Task FOREIGN KEY (TaskId) REFERENCES [Task].[Task](ID),
        CONSTRAINT FK_TaskGroupAssignment_Group FOREIGN KEY (TaskGroupId) REFERENCES [Task].[Group](ID) ON DELETE CASCADE,
        CONSTRAINT FK_TaskGroupAssignment_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID)
    );
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Document' AND schema_id = SCHEMA_ID('Task'))
BEGIN
    CREATE TABLE [Task].[Document] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Task_Document_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Task_Document_GuidId UNIQUE (GuidId),
        TaskId INT NOT NULL,
        DocumentId INT NOT NULL,
        CONSTRAINT FK_TaskDocument_Task FOREIGN KEY (TaskId) REFERENCES [Task].[Task](ID),
        CONSTRAINT FK_TaskDocument_Document FOREIGN KEY (DocumentId) REFERENCES [Document].[Document](ID)
    );
END

-- =============================================
-- [Resource].[GroupAssignment], [Resource].[PatientAssignment]
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GroupAssignment' AND schema_id = SCHEMA_ID('Resource'))
BEGIN
    CREATE TABLE [Resource].[GroupAssignment] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Resource_GroupAssignment_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Resource_GroupAssignment_GuidId UNIQUE (GuidId),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        Active BIT NOT NULL DEFAULT 1,
        ResourceId INT NOT NULL,
        ResourceGroupId INT NOT NULL,
        CONSTRAINT FK_ResourceGroupAssignment_Resource FOREIGN KEY (ResourceId) REFERENCES [Resource].[Resource](ID),
        CONSTRAINT FK_ResourceGroupAssignment_Group FOREIGN KEY (ResourceGroupId) REFERENCES [Resource].[Group](ID),
        CONSTRAINT FK_ResourceGroupAssignment_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID)
    );
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PatientAssignment' AND schema_id = SCHEMA_ID('Resource'))
BEGIN
    CREATE TABLE [Resource].[PatientAssignment] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Resource_PatientAssignment_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Resource_PatientAssignment_GuidId UNIQUE (GuidId),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        Active BIT NOT NULL DEFAULT 1,
        ResourceId INT NOT NULL,
        PatientId INT NOT NULL,
        CONSTRAINT FK_PatientAssignment_Resource FOREIGN KEY (ResourceId) REFERENCES [Resource].[Resource](ID),
        CONSTRAINT FK_PatientAssignment_Patient FOREIGN KEY (PatientId) REFERENCES [ClinicalHistory].[ClinicalHistory](ID),
        CONSTRAINT FK_PatientAssignment_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID)
    );
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Document' AND schema_id = SCHEMA_ID('Resource'))
BEGIN
    CREATE TABLE [Resource].[Document] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Resource_Document_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Resource_Document_GuidId UNIQUE (GuidId),
        ResourceId INT NOT NULL,
        DocumentId INT NOT NULL,
        CONSTRAINT FK_ResourceDocument_Resource FOREIGN KEY (ResourceId) REFERENCES [Resource].[Resource](ID),
        CONSTRAINT FK_ResourceDocument_Document FOREIGN KEY (DocumentId) REFERENCES [Document].[Document](ID)
    );
END

-- =============================================
-- [Security].[Permission], [Security].[RoleUser]
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Permission' AND schema_id = SCHEMA_ID('Security'))
BEGIN
    CREATE TABLE [Security].[Permission] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Security_Permission_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Security_Permission_GuidId UNIQUE (GuidId),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        Active BIT NOT NULL DEFAULT 1,
        RoleId INT NOT NULL,
        EndpointId INT NOT NULL,
        CONSTRAINT FK_Permission_Role FOREIGN KEY (RoleId) REFERENCES [Security].[Role](ID),
        CONSTRAINT FK_Permission_Endpoint FOREIGN KEY (EndpointId) REFERENCES [Security].[Endpoint](ID),
        CONSTRAINT FK_Permission_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID)
    );
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RoleUser' AND schema_id = SCHEMA_ID('Security'))
BEGIN
    CREATE TABLE [Security].[RoleUser] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Security_RoleUser_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Security_RoleUser_GuidId UNIQUE (GuidId),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        Active BIT NOT NULL DEFAULT 1,
        RoleId INT NOT NULL,
        [UserId] INT NOT NULL,
        CONSTRAINT FK_RoleUser_Role FOREIGN KEY (RoleId) REFERENCES [Security].[Role](ID),
        CONSTRAINT FK_RoleUser_User FOREIGN KEY ([UserId]) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_RoleUser_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID)
    );
END

-- =============================================
-- ClinicalHistory junction and detail tables
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Religion' AND schema_id = SCHEMA_ID('ClinicalHistory'))
BEGIN
    CREATE TABLE [ClinicalHistory].[Religion] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_ClinicalHistory_Religion_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_ClinicalHistory_Religion_GuidId UNIQUE (GuidId),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        Active BIT NOT NULL DEFAULT 1,
        ClinicalHistoryId INT NOT NULL,
        ReligionId INT NOT NULL,
        CONSTRAINT FK_ClinicalHistoryReligion_ClinicalHistory FOREIGN KEY (ClinicalHistoryId) REFERENCES [ClinicalHistory].[ClinicalHistory](ID),
        CONSTRAINT FK_ClinicalHistoryReligion_Religion FOREIGN KEY (ReligionId) REFERENCES [General].[Religion](ID),
        CONSTRAINT FK_ClinicalHistoryReligion_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID)
    );
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MaritalStatus' AND schema_id = SCHEMA_ID('ClinicalHistory'))
BEGIN
    CREATE TABLE [ClinicalHistory].[MaritalStatus] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_ClinicalHistory_MaritalStatus_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_ClinicalHistory_MaritalStatus_GuidId UNIQUE (GuidId),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        Active BIT NOT NULL DEFAULT 1,
        ClinicalHistoryId INT NOT NULL,
        MaritalStatusId INT NOT NULL,
        CONSTRAINT FK_ClinicalHistoryMaritalStatus_ClinicalHistory FOREIGN KEY (ClinicalHistoryId) REFERENCES [ClinicalHistory].[ClinicalHistory](ID),
        CONSTRAINT FK_ClinicalHistoryMaritalStatus_MaritalStatus FOREIGN KEY (MaritalStatusId) REFERENCES [General].[MaritalStatus](ID),
        CONSTRAINT FK_ClinicalHistoryMaritalStatus_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID)
    );
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Occupation' AND schema_id = SCHEMA_ID('ClinicalHistory'))
BEGIN
    CREATE TABLE [ClinicalHistory].[Occupation] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_ClinicalHistory_Occupation_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_ClinicalHistory_Occupation_GuidId UNIQUE (GuidId),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        Active BIT NOT NULL DEFAULT 1,
        ClinicalHistoryId INT NOT NULL,
        OccupationId INT NOT NULL,
        CONSTRAINT FK_ClinicalHistoryOccupation_ClinicalHistory FOREIGN KEY (ClinicalHistoryId) REFERENCES [ClinicalHistory].[ClinicalHistory](ID),
        CONSTRAINT FK_ClinicalHistoryOccupation_Occupation FOREIGN KEY (OccupationId) REFERENCES [General].[Occupation](ID),
        CONSTRAINT FK_ClinicalHistoryOccupation_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID)
    );
END
-- =============================================
-- [Tracking].[TrackingSheet] (depends on ClinicalHistory, [Task].[Task])
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TrackingSheet' AND schema_id = SCHEMA_ID('Tracking'))
BEGIN
    CREATE TABLE [Tracking].[TrackingSheet] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Tracking_TrackingSheet_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Tracking_TrackingSheet_GuidId UNIQUE (GuidId),
        Completed BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NOT NULL,
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedBy INT NOT NULL,
        Annotations NVARCHAR(1000) NOT NULL CONSTRAINT DF_Tracking_TrackingSheet_Annotations DEFAULT (''),
        Conclusions NVARCHAR(1000) NOT NULL CONSTRAINT DF_Tracking_TrackingSheet_Conclusions DEFAULT (''),
        SessionNumber INT NOT NULL CONSTRAINT DF_Tracking_TrackingSheet_SessionNumber DEFAULT (0),
        SessionDate DATE NOT NULL,
        NextSessionDate DATE NULL,
        PatientId INT NOT NULL,
        TaskId INT NOT NULL,
        CONSTRAINT FK_TrackingSheet_Patient FOREIGN KEY (PatientId) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_TrackingSheet_Task FOREIGN KEY (TaskId) REFERENCES [Task].[Task](ID),
        CONSTRAINT FK_TrackingSheet_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_TrackingSheet_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES [Person].[Person](ID)
    );
END

-- [Tracking].[TaskTrackingSheet] (self-ref to TrackingSheet)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TaskTrackingSheet' AND schema_id = SCHEMA_ID('Tracking'))
BEGIN
    CREATE TABLE [Tracking].[TaskTrackingSheet] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Tracking_TaskTrackingSheet_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Tracking_TaskTrackingSheet_GuidId UNIQUE (GuidId),
        TrackingSheetId INT NULL,
        CONSTRAINT FK_TaskTrackingSheet_TrackingSheet FOREIGN KEY (TrackingSheetId) REFERENCES [Tracking].[TrackingSheet](ID)
    );
END

-- [Tracking].[TaskAnswer] (depends on TrackingSheet)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TaskAnswer' AND schema_id = SCHEMA_ID('Tracking'))
BEGIN
    CREATE TABLE [Tracking].[TaskAnswer] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Tracking_TaskAnswer_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Tracking_TaskAnswer_GuidId UNIQUE (GuidId),
        Description NVARCHAR(255) NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        TaskTrackingId INT NULL,
        CONSTRAINT FK_TaskAnswer_TrackingSheet FOREIGN KEY (TaskTrackingId) REFERENCES [Tracking].[TrackingSheet](ID),
        CONSTRAINT FK_TaskAnswer_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID)
    );
END

-- Tracking.Comment (depends on TrackingSheet; Comment es palabra reservada)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Comment' AND schema_id = SCHEMA_ID('Tracking'))
BEGIN
    CREATE TABLE [Tracking].[Comment] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Tracking_Comment_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Tracking_Comment_GuidId UNIQUE (GuidId),
        Description NVARCHAR(255) NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        TaskTrackingId INT NULL,
        CONSTRAINT FK_Comment_TrackingSheet FOREIGN KEY (TaskTrackingId) REFERENCES [Tracking].[TrackingSheet](ID),
        CONSTRAINT FK_Comment_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID)
    );
END

-- [Tracking].[Answer] (CommentId FK to Tracking.Comment)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Answer' AND schema_id = SCHEMA_ID('Tracking'))
BEGIN
    CREATE TABLE [Tracking].[Answer] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Tracking_Answer_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Tracking_Answer_GuidId UNIQUE (GuidId),
        Description NVARCHAR(255) NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        UpdatedAt DATETIME NULL,
        UpdatedBy INT NULL,
        CommentId INT NULL,
        CONSTRAINT FK_Answer_Comment FOREIGN KEY (CommentId) REFERENCES [Tracking].[Comment](ID),
        CONSTRAINT FK_Answer_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_Answer_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES [Person].[Person](ID)
    );
END

-- [Tracking].[TaskAnswerDocument] (depends on [Document].[Document], [Tracking].[TaskAnswer])
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TaskAnswerDocument' AND schema_id = SCHEMA_ID('Tracking'))
BEGIN
    CREATE TABLE [Tracking].[TaskAnswerDocument] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Tracking_TaskAnswerDocument_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Tracking_TaskAnswerDocument_GuidId UNIQUE (GuidId),
        DocumentId INT NOT NULL,
        TaskAnswerId INT NOT NULL,
        CONSTRAINT FK_TaskAnswerDocument_Document FOREIGN KEY (DocumentId) REFERENCES [Document].[Document](ID),
        CONSTRAINT FK_TaskAnswerDocument_TaskAnswer FOREIGN KEY (TaskAnswerId) REFERENCES [Tracking].[TaskAnswer](ID)
    );
END

-- =============================================
-- [CognitiveBehavioralTherapy].[Record], [RecordEmotion]
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Record' AND schema_id = SCHEMA_ID('CognitiveBehavioralTherapy'))
BEGIN
    CREATE TABLE [CognitiveBehavioralTherapy].[Record] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_CBT_Record_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_CBT_Record_GuidId UNIQUE (GuidId),
        ActivateEvent NVARCHAR(255) NULL,
        Thoughts NVARCHAR(255) NULL,
        Behavior NVARCHAR(255) NULL,
        EventDate DATE NOT NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        UpdatedAt DATETIME NULL,
        UpdatedBy INT NULL,
        PatientId INT NOT NULL,
        CONSTRAINT FK_CBT_Record_Patient FOREIGN KEY (PatientId) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_CBT_Record_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_CBT_Record_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES [Person].[Person](ID)
    );
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RecordEmotion' AND schema_id = SCHEMA_ID('CognitiveBehavioralTherapy'))
BEGIN
    CREATE TABLE [CognitiveBehavioralTherapy].[RecordEmotion] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_CBT_RecordEmotion_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_CBT_RecordEmotion_GuidId UNIQUE (GuidId),
        Scale INT NOT NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        UpdatedAt DATETIME NULL,
        UpdatedBy INT NULL,
        EmotionId INT NOT NULL,
        RecordId INT NOT NULL,
        CONSTRAINT FK_CBT_RecordEmotion_Emotion FOREIGN KEY (EmotionId) REFERENCES [General].[Emotion](ID),
        CONSTRAINT FK_CBT_RecordEmotion_Record FOREIGN KEY (RecordId) REFERENCES [CognitiveBehavioralTherapy].[Record](ID),
        CONSTRAINT FK_CBT_RecordEmotion_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_CBT_RecordEmotion_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES [Person].[Person](ID)
    );
END

-- =============================================
-- [Report].[PsychologicalReport]
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PsychologicalReport' AND schema_id = SCHEMA_ID('Report'))
BEGIN
    CREATE TABLE [Report].[PsychologicalReport] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Report_PsychologicalReport_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_Report_PsychologicalReport_GuidId UNIQUE (GuidId),
        Results NVARCHAR(1000) NULL,
        Antecedents NVARCHAR(1000) NULL,
        Completed BIT NOT NULL DEFAULT 0,
        Recommendations NVARCHAR(1000) NULL,
        DiagnosticImpression NVARCHAR(1000) NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        UpdatedAt DATETIME NULL,
        UpdatedBy INT NULL,
        PatientId INT NOT NULL,
        PsychologistId INT NOT NULL,
        CONSTRAINT FK_PsychologicalReport_Patient FOREIGN KEY (PatientId) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_PsychologicalReport_Psychologist FOREIGN KEY (PsychologistId) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_PsychologicalReport_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_PsychologicalReport_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES [Person].[Person](ID)
    );
END

-- =============================================
-- [ClinicalHistory].[RecordType] (catalog — no audit columns, alineado a PatientStatus)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RecordType' AND schema_id = SCHEMA_ID('ClinicalHistory'))
BEGIN
    CREATE TABLE [ClinicalHistory].[RecordType] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_ClinicalHistory_RecordType_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_ClinicalHistory_RecordType_GuidId UNIQUE (GuidId),
        Description NVARCHAR(100) NOT NULL
    );
END

-- =============================================
-- [ClinicalHistory].[Record]
-- Depends on: ClinicalHistory.ClinicalHistory, ClinicalHistory.RecordType, Person.Person
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Record' AND schema_id = SCHEMA_ID('ClinicalHistory'))
BEGIN
    CREATE TABLE [ClinicalHistory].[Record] (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        GuidId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_ClinicalHistory_Record_GuidId DEFAULT NEWSEQUENTIALID(),
        CONSTRAINT UQ_ClinicalHistory_Record_GuidId UNIQUE (GuidId),
        Description NVARCHAR(1000) NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CreatedBy INT NULL,
        UpdatedAt DATETIME NULL,
        UpdatedBy INT NULL,
        Active BIT NOT NULL DEFAULT 1,
        ClinicalHistoryId INT NOT NULL,
        ClinicalHistoryRecordTypeId INT NOT NULL,
        CONSTRAINT FK_Record_ClinicalHistory FOREIGN KEY (ClinicalHistoryId) REFERENCES [ClinicalHistory].[ClinicalHistory](ID),
        CONSTRAINT FK_Record_RecordType FOREIGN KEY (ClinicalHistoryRecordTypeId) REFERENCES [ClinicalHistory].[RecordType](ID),
        CONSTRAINT FK_Record_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES [Person].[Person](ID),
        CONSTRAINT FK_Record_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES [Person].[Person](ID)
    );
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_Record_ClinicalHistoryId' AND object_id = OBJECT_ID('[ClinicalHistory].[Record]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_Record_ClinicalHistoryId ON [ClinicalHistory].[Record](ClinicalHistoryId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_Record_ClinicalHistoryRecordTypeId' AND object_id = OBJECT_ID('[ClinicalHistory].[Record]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_Record_ClinicalHistoryRecordTypeId ON [ClinicalHistory].[Record](ClinicalHistoryRecordTypeId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_Record_Active' AND object_id = OBJECT_ID('[ClinicalHistory].[Record]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_Record_Active ON [ClinicalHistory].[Record](Active);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClinicalHistory_Record_CreatedAt' AND object_id = OBJECT_ID('[ClinicalHistory].[Record]'))
    CREATE NONCLUSTERED INDEX IX_ClinicalHistory_Record_CreatedAt ON [ClinicalHistory].[Record](CreatedAt);

PRINT 'Sidae Data Model migration completed successfully.';

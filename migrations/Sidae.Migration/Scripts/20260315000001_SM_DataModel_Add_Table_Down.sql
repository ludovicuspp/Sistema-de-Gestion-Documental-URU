-- =============================================
-- Migration Down: Drop Sidae Data Model Tables
-- =============================================
-- Drops tables in reverse dependency order, then schemas.

-- CognitiveBehavioralTherapy
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'RecordEmotion' AND schema_id = SCHEMA_ID('CognitiveBehavioralTherapy'))
    DROP TABLE [CognitiveBehavioralTherapy].[RecordEmotion];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Record' AND schema_id = SCHEMA_ID('CognitiveBehavioralTherapy'))
    DROP TABLE [CognitiveBehavioralTherapy].[Record];

-- Report
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'PsychologicalReport' AND schema_id = SCHEMA_ID('Report'))
    DROP TABLE [Report].[PsychologicalReport];

-- Tracking
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'TaskAnswerDocument' AND schema_id = SCHEMA_ID('Tracking'))
    DROP TABLE [Tracking].[TaskAnswerDocument];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Answer' AND schema_id = SCHEMA_ID('Tracking'))
    DROP TABLE [Tracking].[Answer];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Comment' AND schema_id = SCHEMA_ID('Tracking'))
    DROP TABLE [Tracking].[Comment];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'TaskAnswer' AND schema_id = SCHEMA_ID('Tracking'))
    DROP TABLE [Tracking].[TaskAnswer];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'TaskTrackingSheet' AND schema_id = SCHEMA_ID('Tracking'))
    DROP TABLE [Tracking].[TaskTrackingSheet];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'TrackingSheet' AND schema_id = SCHEMA_ID('Tracking'))
    DROP TABLE [Tracking].[TrackingSheet];

-- ClinicalHistory (detail/junction)
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Record' AND schema_id = SCHEMA_ID('ClinicalHistory'))
    DROP TABLE [ClinicalHistory].[Record];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'RecordType' AND schema_id = SCHEMA_ID('ClinicalHistory'))
    DROP TABLE [ClinicalHistory].[RecordType];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Occupation' AND schema_id = SCHEMA_ID('ClinicalHistory'))
    DROP TABLE [ClinicalHistory].[Occupation];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'MaritalStatus' AND schema_id = SCHEMA_ID('ClinicalHistory'))
    DROP TABLE [ClinicalHistory].[MaritalStatus];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Religion' AND schema_id = SCHEMA_ID('ClinicalHistory'))
    DROP TABLE [ClinicalHistory].[Religion];

-- Security
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'RoleUser' AND schema_id = SCHEMA_ID('Security'))
    DROP TABLE [Security].[RoleUser];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Permission' AND schema_id = SCHEMA_ID('Security'))
    DROP TABLE [Security].[Permission];

-- Task tables that reference Resource (must drop before Resource schema)
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'GroupAssignment' AND schema_id = SCHEMA_ID('Task'))
    DROP TABLE [Task].[GroupAssignment];

-- Drop ALL foreign keys that reference [Resource].[Resource] (single batch + FOR XML PATH so all FKs are dropped)
EXEC sp_executesql N'
DECLARE @refId INT = OBJECT_ID(''[Resource].[Resource]'');
IF @refId IS NOT NULL
BEGIN
    DECLARE @sql NVARCHAR(MAX);
    SELECT @sql = ISNULL((
        SELECT N''ALTER TABLE '' + QUOTENAME(OBJECT_SCHEMA_NAME(fk.parent_object_id)) + N''.'' + QUOTENAME(OBJECT_NAME(fk.parent_object_id)) + N'' DROP CONSTRAINT '' + QUOTENAME(fk.name) + N'';''
        FROM sys.foreign_keys fk
        WHERE fk.referenced_object_id = @refId
        FOR XML PATH(''''), TYPE
    ).value(''.'', ''NVARCHAR(MAX)''), N'''');
    IF LEN(@sql) > 0
        EXEC sp_executesql @sql;
END';

-- Resource
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Document' AND schema_id = SCHEMA_ID('Resource'))
    DROP TABLE [Resource].[Document];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'PatientAssignment' AND schema_id = SCHEMA_ID('Resource'))
    DROP TABLE [Resource].[PatientAssignment];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'GroupAssignment' AND schema_id = SCHEMA_ID('Resource'))
    DROP TABLE [Resource].[GroupAssignment];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Group' AND schema_id = SCHEMA_ID('Resource'))
    DROP TABLE [Resource].[Group];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Resource' AND schema_id = SCHEMA_ID('Resource'))
    DROP TABLE [Resource].[Resource];

-- Task
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'GroupAssignment' AND schema_id = SCHEMA_ID('Task'))
    DROP TABLE [Task].[GroupAssignment];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Document' AND schema_id = SCHEMA_ID('Task'))
    DROP TABLE [Task].[Document];

-- ClinicalHistory main
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'ClinicalHistory' AND schema_id = SCHEMA_ID('ClinicalHistory'))
    DROP TABLE [ClinicalHistory].[ClinicalHistory];

-- Document, Task, Person
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Document' AND schema_id = SCHEMA_ID('Document'))
    DROP TABLE [Document].[Document];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Task' AND schema_id = SCHEMA_ID('Task'))
    DROP TABLE [Task].[Task];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Group' AND schema_id = SCHEMA_ID('Task'))
    DROP TABLE [Task].[Group];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'PatientTherapyType' AND schema_id = SCHEMA_ID('Person'))
    DROP TABLE [Person].[PatientTherapyType];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Person' AND schema_id = SCHEMA_ID('Person'))
    DROP TABLE [Person].[Person];

-- Root tables
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'PatientStatus' AND schema_id = SCHEMA_ID('ClinicalHistory'))
    DROP TABLE [ClinicalHistory].[PatientStatus];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'MimeType' AND schema_id = SCHEMA_ID('Document'))
    DROP TABLE [Document].[MimeType];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Role' AND schema_id = SCHEMA_ID('Security'))
    DROP TABLE [Security].[Role];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Endpoint' AND schema_id = SCHEMA_ID('Security'))
    DROP TABLE [Security].[Endpoint];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Action' AND schema_id = SCHEMA_ID('Security'))
    DROP TABLE [Security].[Action];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Occupation' AND schema_id = SCHEMA_ID('General'))
    DROP TABLE [General].[Occupation];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'MaritalStatus' AND schema_id = SCHEMA_ID('General'))
    DROP TABLE [General].[MaritalStatus];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Religion' AND schema_id = SCHEMA_ID('General'))
    DROP TABLE [General].[Religion];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'TherapyType' AND schema_id = SCHEMA_ID('General'))
    DROP TABLE [General].[TherapyType];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Emotion' AND schema_id = SCHEMA_ID('General'))
    DROP TABLE [General].[Emotion];
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Gender' AND schema_id = SCHEMA_ID('Person'))
    DROP TABLE [Person].[Gender];

-- Drop schemas
IF EXISTS (SELECT * FROM sys.schemas WHERE name = 'Report')
    DROP SCHEMA [Report];
IF EXISTS (SELECT * FROM sys.schemas WHERE name = 'CognitiveBehavioralTherapy')
    DROP SCHEMA [CognitiveBehavioralTherapy];
IF EXISTS (SELECT * FROM sys.schemas WHERE name = 'Tracking')
    DROP SCHEMA [Tracking];
IF EXISTS (SELECT * FROM sys.schemas WHERE name = 'ClinicalHistory')
    DROP SCHEMA [ClinicalHistory];
IF EXISTS (SELECT * FROM sys.schemas WHERE name = 'Security')
    DROP SCHEMA [Security];
IF EXISTS (SELECT * FROM sys.schemas WHERE name = 'Resource')
    DROP SCHEMA [Resource];
IF EXISTS (SELECT * FROM sys.schemas WHERE name = 'Task')
    DROP SCHEMA [Task];
IF EXISTS (SELECT * FROM sys.schemas WHERE name = 'Document')
    DROP SCHEMA [Document];
IF EXISTS (SELECT * FROM sys.schemas WHERE name = 'General')
    DROP SCHEMA [General];
IF EXISTS (SELECT * FROM sys.schemas WHERE name = 'Person')
    DROP SCHEMA [Person];

PRINT 'Sidae Data Model migration rolled back successfully.';

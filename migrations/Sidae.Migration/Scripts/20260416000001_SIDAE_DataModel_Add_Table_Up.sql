-- =============================================
-- Migration Up: SIDAE - Create Data Model Tables
-- =============================================
-- Schemas: General, Security, Task, Person, Student,
--          Record, Document, Request, Audit, System
-- GuidId se genera automáticamente con gen_random_uuid() (PostgreSQL 13+)

-- =============================================
-- SCHEMAS
-- =============================================
CREATE SCHEMA IF NOT EXISTS "General";
CREATE SCHEMA IF NOT EXISTS "Security";
CREATE SCHEMA IF NOT EXISTS "Task";
CREATE SCHEMA IF NOT EXISTS "Person";
CREATE SCHEMA IF NOT EXISTS "Student";
CREATE SCHEMA IF NOT EXISTS "Record";
CREATE SCHEMA IF NOT EXISTS "Document";
CREATE SCHEMA IF NOT EXISTS "Request";
CREATE SCHEMA IF NOT EXISTS "Audit";
CREATE SCHEMA IF NOT EXISTS "System";

-- =============================================
-- GENERAL
-- =============================================

CREATE TABLE IF NOT EXISTS "General"."AcademicLevel" (
    "Id"          SERIAL       PRIMARY KEY,
    "GuidId"      UUID         NOT NULL DEFAULT gen_random_uuid(),
    "Description" VARCHAR(100) NOT NULL,
    CONSTRAINT "UQ_General_AcademicLevel_GuidId" UNIQUE ("GuidId")
);

CREATE TABLE IF NOT EXISTS "General"."Career" (
    "Id"          SERIAL       PRIMARY KEY,
    "GuidId"      UUID         NOT NULL DEFAULT gen_random_uuid(),
    "Description" VARCHAR(100) NOT NULL,
    CONSTRAINT "UQ_General_Career_GuidId" UNIQUE ("GuidId")
);

-- =============================================
-- SECURITY
-- Orden: Action → Endpoint → Role → Users → Permission → RoleUser
-- =============================================

CREATE TABLE IF NOT EXISTS "Security"."Action" (
    "Id"     SERIAL      PRIMARY KEY,
    "GuidId" UUID        NOT NULL DEFAULT gen_random_uuid(),
    "Name"   VARCHAR(30) NOT NULL,
    CONSTRAINT "UQ_Security_Action_GuidId" UNIQUE ("GuidId")
);

CREATE TABLE IF NOT EXISTS "Security"."Endpoint" (
    "Id"     SERIAL      PRIMARY KEY,
    "GuidId" UUID        NOT NULL DEFAULT gen_random_uuid(),
    "Name"   VARCHAR(30) NOT NULL,
    CONSTRAINT "UQ_Security_Endpoint_GuidId" UNIQUE ("GuidId")
);

CREATE TABLE IF NOT EXISTS "Security"."Role" (
    "Id"     SERIAL      PRIMARY KEY,
    "GuidId" UUID        NOT NULL DEFAULT gen_random_uuid(),
    "Name"   VARCHAR(30) NOT NULL,
    CONSTRAINT "UQ_Security_Role_GuidId" UNIQUE ("GuidId")
);

CREATE TABLE IF NOT EXISTS "Security"."Users" (
    "Id"           SERIAL       PRIMARY KEY,
    "GuidId"       UUID         NOT NULL DEFAULT gen_random_uuid(),
    "Username"     VARCHAR(100) NOT NULL,
    "PasswordHash" VARCHAR(255) NOT NULL,
    "Email"        VARCHAR(60)  NOT NULL,
    "IsActive"     BOOLEAN      NOT NULL DEFAULT TRUE,
    "RoleId"       INT          NOT NULL,
    CONSTRAINT "UQ_Security_Users_GuidId" UNIQUE ("GuidId"),
    CONSTRAINT "FK_Security_Users_Role"
        FOREIGN KEY ("RoleId") REFERENCES "Security"."Role" ("Id")
);

CREATE TABLE IF NOT EXISTS "Security"."Permission" (
    "Id"         SERIAL       PRIMARY KEY,
    "GuidId"     UUID         NOT NULL DEFAULT gen_random_uuid(),
    "Action"     VARCHAR(155) NOT NULL,
    "RoleId"     INT          NOT NULL,
    "ActionId"   INT          NOT NULL,
    "EndpointId" INT          NOT NULL,
    CONSTRAINT "UQ_Security_Permission_GuidId" UNIQUE ("GuidId"),
    CONSTRAINT "FK_Security_Permission_Role"
        FOREIGN KEY ("RoleId")     REFERENCES "Security"."Role"     ("Id"),
    CONSTRAINT "FK_Security_Permission_Action"
        FOREIGN KEY ("ActionId")   REFERENCES "Security"."Action"   ("Id"),
    CONSTRAINT "FK_Security_Permission_Endpoint"
        FOREIGN KEY ("EndpointId") REFERENCES "Security"."Endpoint" ("Id")
);

CREATE TABLE IF NOT EXISTS "Security"."RoleUser" (
    "Id"        SERIAL    PRIMARY KEY,
    "GuidId"    UUID      NOT NULL DEFAULT gen_random_uuid(),
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "Active"    BOOLEAN   NOT NULL DEFAULT TRUE,
    "CreatedBy" INT       NOT NULL,
    "RoleId"    INT       NOT NULL,
    "UserId"    INT       NOT NULL,
    CONSTRAINT "UQ_Security_RoleUser_GuidId" UNIQUE ("GuidId"),
    CONSTRAINT "FK_Security_RoleUser_Role"
        FOREIGN KEY ("RoleId")    REFERENCES "Security"."Role"  ("Id"),
    CONSTRAINT "FK_Security_RoleUser_User"
        FOREIGN KEY ("UserId")    REFERENCES "Security"."Users" ("Id"),
    CONSTRAINT "FK_Security_RoleUser_CreatedBy"
        FOREIGN KEY ("CreatedBy") REFERENCES "Security"."Users" ("Id")
);

-- =============================================
-- TASK
-- Orden: Status → Task
-- =============================================

CREATE TABLE IF NOT EXISTS "Task"."Status" (
    "Id"          SERIAL       PRIMARY KEY,
    "GuidId"      UUID         NOT NULL DEFAULT gen_random_uuid(),
    "Description" VARCHAR(100) NOT NULL,
    CONSTRAINT "UQ_Task_Status_GuidId" UNIQUE ("GuidId")
);

CREATE TABLE IF NOT EXISTS "Task"."Task" (
    "Id"           SERIAL      PRIMARY KEY,
    "GuidId"       UUID        NOT NULL DEFAULT gen_random_uuid(),
    "Title"        VARCHAR(50) NOT NULL,
    "Description"  VARCHAR(50),
    "Capacity"     INT,
    "CreatedAt"    TIMESTAMP   NOT NULL DEFAULT NOW(),
    "StatusId"     INT         NOT NULL,
    "AssignedToId" INT,
    "AssignedById" INT,
    CONSTRAINT "UQ_Task_Task_GuidId" UNIQUE ("GuidId"),
    CONSTRAINT "FK_Task_Task_Status"
        FOREIGN KEY ("StatusId")     REFERENCES "Task"."Status"    ("Id"),
    CONSTRAINT "FK_Task_Task_AssignedTo"
        FOREIGN KEY ("AssignedToId") REFERENCES "Security"."Users" ("Id"),
    CONSTRAINT "FK_Task_Task_AssignedBy"
        FOREIGN KEY ("AssignedById") REFERENCES "Security"."Users" ("Id")
);

-- =============================================
-- PERSON
-- Depende de: Security.Users
-- =============================================

CREATE TABLE IF NOT EXISTS "Person"."Person" (
    "Id"          SERIAL      PRIMARY KEY,
    "GuidId"      UUID        NOT NULL DEFAULT gen_random_uuid(),
    "FirstName"   VARCHAR(30) NOT NULL,
    "LastName"    VARCHAR(30) NOT NULL,
    "CI"          VARCHAR(30) NOT NULL,
    "Email"       VARCHAR(40),
    "PhoneNumber" VARCHAR(30),
    "Birthdate"   DATE,
    "CreatedAt"   TIMESTAMP   NOT NULL DEFAULT NOW(),
    "UpdatedAt"   TIMESTAMP,
    "Active"      BOOLEAN     NOT NULL DEFAULT TRUE,
    "GenderId"    INT,
    "UserId"      INT,
    "CreatedById" INT,
    "UpdatedById" INT,
    CONSTRAINT "UQ_Person_Person_GuidId" UNIQUE ("GuidId"),
    CONSTRAINT "FK_Person_Person_User"
        FOREIGN KEY ("UserId")      REFERENCES "Security"."Users" ("Id"),
    CONSTRAINT "FK_Person_Person_CreatedBy"
        FOREIGN KEY ("CreatedById") REFERENCES "Security"."Users" ("Id"),
    CONSTRAINT "FK_Person_Person_UpdatedBy"
        FOREIGN KEY ("UpdatedById") REFERENCES "Security"."Users" ("Id")
);

-- =============================================
-- STUDENT
-- Orden: Status → Student → Career
-- Student depende de: General.AcademicLevel, Person.Person, Student.Status
-- =============================================

CREATE TABLE IF NOT EXISTS "Student"."Status" (
    "Id"          SERIAL      PRIMARY KEY,
    "GuidId"      UUID        NOT NULL DEFAULT gen_random_uuid(),
    "Description" VARCHAR(20) NOT NULL,
    CONSTRAINT "UQ_Student_Status_GuidId" UNIQUE ("GuidId")
);

CREATE TABLE IF NOT EXISTS "Student"."Student" (
    "Id"              SERIAL    PRIMARY KEY,
    "GuidId"          UUID      NOT NULL DEFAULT gen_random_uuid(),
    "CreatedAt"       TIMESTAMP NOT NULL DEFAULT NOW(),
    "AcademicLevelId" INT       NOT NULL,
    "PersonId"        INT       NOT NULL,
    "StudentStatusId" INT       NOT NULL,
    "AssignedById"    INT,
    CONSTRAINT "UQ_Student_Student_GuidId" UNIQUE ("GuidId"),
    CONSTRAINT "FK_Student_Student_AcademicLevel"
        FOREIGN KEY ("AcademicLevelId") REFERENCES "General"."AcademicLevel" ("Id"),
    CONSTRAINT "FK_Student_Student_Person"
        FOREIGN KEY ("PersonId")        REFERENCES "Person"."Person"          ("Id"),
    CONSTRAINT "FK_Student_Student_StudentStatus"
        FOREIGN KEY ("StudentStatusId") REFERENCES "Student"."Status"         ("Id"),
    CONSTRAINT "FK_Student_Student_AssignedBy"
        FOREIGN KEY ("AssignedById")    REFERENCES "Security"."Users"         ("Id")
);

CREATE TABLE IF NOT EXISTS "Student"."Career" (
    "Id"        SERIAL PRIMARY KEY,
    "GuidId"    UUID   NOT NULL DEFAULT gen_random_uuid(),
    "StudentId" INT    NOT NULL,
    "CareerId"  INT    NOT NULL,
    CONSTRAINT "UQ_Student_Career_GuidId" UNIQUE ("GuidId"),
    CONSTRAINT "FK_Student_Career_Student"
        FOREIGN KEY ("StudentId") REFERENCES "Student"."Student" ("Id"),
    CONSTRAINT "FK_Student_Career_Career"
        FOREIGN KEY ("CareerId")  REFERENCES "General"."Career"  ("Id")
);

-- =============================================
-- RECORD
-- Orden: FolderStatus → FolderType → PhysicalLocation → Folder
-- Folder depende de: Student.Student
-- =============================================

CREATE TABLE IF NOT EXISTS "Record"."FolderStatus" (
    "Id"     SERIAL      PRIMARY KEY,
    "GuidId" UUID        NOT NULL DEFAULT gen_random_uuid(),
    "Name"   VARCHAR(60) NOT NULL,
    CONSTRAINT "UQ_Record_FolderStatus_GuidId" UNIQUE ("GuidId")
);

CREATE TABLE IF NOT EXISTS "Record"."FolderType" (
    "Id"     SERIAL      PRIMARY KEY,
    "GuidId" UUID        NOT NULL DEFAULT gen_random_uuid(),
    "Name"   VARCHAR(40) NOT NULL,
    CONSTRAINT "UQ_Record_FolderType_GuidId" UNIQUE ("GuidId")
);

CREATE TABLE IF NOT EXISTS "Record"."PhysicalLocation" (
    "Id"       SERIAL       PRIMARY KEY,
    "GuidId"   UUID         NOT NULL DEFAULT gen_random_uuid(),
    "Shelf"    VARCHAR(50)  NOT NULL,
    "Box"      VARCHAR(50)  NOT NULL,
    "Row"      VARCHAR(100) NOT NULL,
    "Capacity" INT,
    CONSTRAINT "UQ_Record_PhysicalLocation_GuidId" UNIQUE ("GuidId")
);

CREATE TABLE IF NOT EXISTS "Record"."Folder" (
    "Id"                 SERIAL      PRIMARY KEY,
    "GuidId"             UUID        NOT NULL DEFAULT gen_random_uuid(),
    "Description"        VARCHAR(50),
    "CreatedAt"          TIMESTAMP   NOT NULL DEFAULT NOW(),
    "StudentId"          INT         NOT NULL,
    "FolderStatusId"     INT         NOT NULL,
    "FolderTypeId"       INT         NOT NULL,
    "PhysicalLocationId" INT,
    "CreatedById"        INT,
    CONSTRAINT "UQ_Record_Folder_GuidId" UNIQUE ("GuidId"),
    CONSTRAINT "FK_Record_Folder_Student"
        FOREIGN KEY ("StudentId")          REFERENCES "Student"."Student"         ("Id"),
    CONSTRAINT "FK_Record_Folder_FolderStatus"
        FOREIGN KEY ("FolderStatusId")     REFERENCES "Record"."FolderStatus"     ("Id"),
    CONSTRAINT "FK_Record_Folder_FolderType"
        FOREIGN KEY ("FolderTypeId")       REFERENCES "Record"."FolderType"       ("Id"),
    CONSTRAINT "FK_Record_Folder_PhysicalLocation"
        FOREIGN KEY ("PhysicalLocationId") REFERENCES "Record"."PhysicalLocation" ("Id"),
    CONSTRAINT "FK_Record_Folder_CreatedBy"
        FOREIGN KEY ("CreatedById")        REFERENCES "Security"."Users"          ("Id")
);

-- =============================================
-- DOCUMENT
-- Orden: MimeType → Type → Document
-- Document depende de: Record.Folder
-- =============================================

CREATE TABLE IF NOT EXISTS "Document"."MimeType" (
    "Id"     SERIAL       PRIMARY KEY,
    "GuidId" UUID         NOT NULL DEFAULT gen_random_uuid(),
    "Name"   VARCHAR(100) NOT NULL,
    CONSTRAINT "UQ_Document_MimeType_GuidId" UNIQUE ("GuidId")
);

CREATE TABLE IF NOT EXISTS "Document"."Type" (
    "Id"            SERIAL       PRIMARY KEY,
    "GuidId"        UUID         NOT NULL DEFAULT gen_random_uuid(),
    "Name"          VARCHAR(100) NOT NULL,
    "IsMandatory"   BOOLEAN      NOT NULL DEFAULT FALSE,
    "RequiredLevel" VARCHAR(50),
    CONSTRAINT "UQ_Document_Type_GuidId" UNIQUE ("GuidId")
);

CREATE TABLE IF NOT EXISTS "Document"."Document" (
    "Id"             SERIAL       PRIMARY KEY,
    "GuidId"         UUID         NOT NULL DEFAULT gen_random_uuid(),
    "Url"            VARCHAR(400) NOT NULL,
    "Name"           VARCHAR(100) NOT NULL,
    "Size"           BIGINT,
    "CreatedAt"      TIMESTAMP    NOT NULL DEFAULT NOW(),
    "UpdatedAt"      TIMESTAMP,
    "Active"         BOOLEAN      NOT NULL DEFAULT TRUE,
    "FolderId"       INT          NOT NULL,
    "MimeTypeId"     INT,
    "DocumentTypeId" INT,
    "CreatedById"    INT,
    "UpdatedById"    INT,
    CONSTRAINT "UQ_Document_Document_GuidId" UNIQUE ("GuidId"),
    CONSTRAINT "FK_Document_Document_Folder"
        FOREIGN KEY ("FolderId")       REFERENCES "Record"."Folder"     ("Id"),
    CONSTRAINT "FK_Document_Document_MimeType"
        FOREIGN KEY ("MimeTypeId")     REFERENCES "Document"."MimeType" ("Id"),
    CONSTRAINT "FK_Document_Document_DocumentType"
        FOREIGN KEY ("DocumentTypeId") REFERENCES "Document"."Type"     ("Id"),
    CONSTRAINT "FK_Document_Document_CreatedBy"
        FOREIGN KEY ("CreatedById")    REFERENCES "Security"."Users"    ("Id"),
    CONSTRAINT "FK_Document_Document_UpdatedBy"
        FOREIGN KEY ("UpdatedById")    REFERENCES "Security"."Users"    ("Id")
);

-- =============================================
-- RECORD.OBSERVATION
-- Depende de: Record.Folder, Document.Document
-- =============================================

CREATE TABLE IF NOT EXISTS "Record"."Observation" (
    "Id"         SERIAL    PRIMARY KEY,
    "GuidId"     UUID      NOT NULL DEFAULT gen_random_uuid(),
    "Comment"    TEXT,
    "CreatedAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
    "IsResolved" BOOLEAN   NOT NULL DEFAULT FALSE,
    "FolderId"   INT       NOT NULL,
    "DocumentId" INT,
    "AuthorId"   INT,
    CONSTRAINT "UQ_Record_Observation_GuidId" UNIQUE ("GuidId"),
    CONSTRAINT "FK_Record_Observation_Folder"
        FOREIGN KEY ("FolderId")   REFERENCES "Record"."Folder"     ("Id"),
    CONSTRAINT "FK_Record_Observation_Document"
        FOREIGN KEY ("DocumentId") REFERENCES "Document"."Document" ("Id"),
    CONSTRAINT "FK_Record_Observation_Author"
        FOREIGN KEY ("AuthorId")   REFERENCES "Security"."Users"    ("Id")
);

-- =============================================
-- REQUEST
-- Orden: Status → Request → DocumentType
-- Request depende de: Student.Student
-- =============================================

CREATE TABLE IF NOT EXISTS "Request"."Status" (
    "Id"          SERIAL      PRIMARY KEY,
    "GuidId"      UUID        NOT NULL DEFAULT gen_random_uuid(),
    "Description" VARCHAR(50) NOT NULL,
    CONSTRAINT "UQ_Request_Status_GuidId" UNIQUE ("GuidId")
);

CREATE TABLE IF NOT EXISTS "Request"."Request" (
    "Id"              SERIAL       PRIMARY KEY,
    "GuidId"          UUID         NOT NULL DEFAULT gen_random_uuid(),
    "EmailContact"    VARCHAR(100) NOT NULL,
    "TrackingCode"    VARCHAR(100),
    "RequestAt"       TIMESTAMP    NOT NULL DEFAULT NOW(),
    "StudentId"       INT,
    "StatusRequestId" INT          NOT NULL,
    CONSTRAINT "UQ_Request_Request_GuidId" UNIQUE ("GuidId"),
    CONSTRAINT "FK_Request_Request_Student"
        FOREIGN KEY ("StudentId")       REFERENCES "Student"."Student" ("Id"),
    CONSTRAINT "FK_Request_Request_StatusRequest"
        FOREIGN KEY ("StatusRequestId") REFERENCES "Request"."Status"  ("Id")
);

CREATE TABLE IF NOT EXISTS "Request"."DocumentType" (
    "Id"             SERIAL PRIMARY KEY,
    "GuidId"         UUID   NOT NULL DEFAULT gen_random_uuid(),
    "RequestId"      INT    NOT NULL,
    "DocumentTypeId" INT    NOT NULL,
    CONSTRAINT "UQ_Request_DocumentType_GuidId" UNIQUE ("GuidId"),
    CONSTRAINT "FK_Request_DocumentType_Request"
        FOREIGN KEY ("RequestId")      REFERENCES "Request"."Request" ("Id"),
    CONSTRAINT "FK_Request_DocumentType_DocumentType"
        FOREIGN KEY ("DocumentTypeId") REFERENCES "Document"."Type"   ("Id")
);

-- =============================================
-- AUDIT
-- =============================================

CREATE TABLE IF NOT EXISTS "Audit"."Log" (
    "Id"                SERIAL       PRIMARY KEY,
    "GuidId"            UUID         NOT NULL DEFAULT gen_random_uuid(),
    "ActionDescription" TEXT,
    "EntityAffected"    VARCHAR(100),
    "Details"           TEXT,
    "IpAddress"         VARCHAR(50),
    "PersonId"          INT,
    CONSTRAINT "UQ_Audit_Log_GuidId" UNIQUE ("GuidId"),
    CONSTRAINT "FK_Audit_Log_Person"
        FOREIGN KEY ("PersonId") REFERENCES "Person"."Person" ("Id")
);

-- =============================================
-- SYSTEM
-- =============================================

CREATE TABLE IF NOT EXISTS "System"."Setting" (
    "Id"          SERIAL PRIMARY KEY,
    "GuidId"      UUID   NOT NULL DEFAULT gen_random_uuid(),
    "Value"       TEXT,
    "Description" TEXT,
    CONSTRAINT "UQ_System_Setting_GuidId" UNIQUE ("GuidId")
);

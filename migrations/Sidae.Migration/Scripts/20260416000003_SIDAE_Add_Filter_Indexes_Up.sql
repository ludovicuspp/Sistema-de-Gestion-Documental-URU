-- =============================================
-- SIDAE - Add filter indexes by column
-- =============================================
-- Nota: se crean indices no unicos para optimizar filtros.
-- Se omiten PK/GuidId porque ya tienen indice por PK/UNIQUE.

-- General
CREATE INDEX IF NOT EXISTS "IX_General_AcademicLevel_Name" ON "General"."AcademicLevel" ("Name");
CREATE INDEX IF NOT EXISTS "IX_General_Career_Name" ON "General"."Career" ("Name");

-- Security
CREATE INDEX IF NOT EXISTS "IX_Security_Action_Name" ON "Security"."Action" ("Name");
CREATE INDEX IF NOT EXISTS "IX_Security_Endpoint_Name" ON "Security"."Endpoint" ("Name");
CREATE INDEX IF NOT EXISTS "IX_Security_Role_Name" ON "Security"."Role" ("Name");
CREATE INDEX IF NOT EXISTS "IX_Security_User_Username" ON "Security"."User" ("Username");
CREATE INDEX IF NOT EXISTS "IX_Security_User_PasswordHash" ON "Security"."User" ("PasswordHash");
CREATE INDEX IF NOT EXISTS "IX_Security_User_Email" ON "Security"."User" ("Email");
CREATE INDEX IF NOT EXISTS "IX_Security_User_IsActive" ON "Security"."User" ("IsActive");
CREATE INDEX IF NOT EXISTS "IX_Security_User_RoleId" ON "Security"."User" ("RoleId");
CREATE INDEX IF NOT EXISTS "IX_Security_Permission_Action" ON "Security"."Permission" ("Action");
CREATE INDEX IF NOT EXISTS "IX_Security_Permission_RoleId" ON "Security"."Permission" ("RoleId");
CREATE INDEX IF NOT EXISTS "IX_Security_Permission_ActionId" ON "Security"."Permission" ("ActionId");
CREATE INDEX IF NOT EXISTS "IX_Security_Permission_EndpointId" ON "Security"."Permission" ("EndpointId");
CREATE INDEX IF NOT EXISTS "IX_Security_RoleUser_CreatedAt" ON "Security"."RoleUser" ("CreatedAt");
CREATE INDEX IF NOT EXISTS "IX_Security_RoleUser_Active" ON "Security"."RoleUser" ("Active");
CREATE INDEX IF NOT EXISTS "IX_Security_RoleUser_CreatedBy" ON "Security"."RoleUser" ("CreatedBy");
CREATE INDEX IF NOT EXISTS "IX_Security_RoleUser_RoleId" ON "Security"."RoleUser" ("RoleId");
CREATE INDEX IF NOT EXISTS "IX_Security_RoleUser_UserId" ON "Security"."RoleUser" ("UserId");

-- Task
CREATE INDEX IF NOT EXISTS "IX_Task_Status_Description" ON "Task"."Status" ("Description");
CREATE INDEX IF NOT EXISTS "IX_Task_Task_Title" ON "Task"."Task" ("Title");
CREATE INDEX IF NOT EXISTS "IX_Task_Task_Description" ON "Task"."Task" ("Description");
CREATE INDEX IF NOT EXISTS "IX_Task_Task_Capacity" ON "Task"."Task" ("Capacity");
CREATE INDEX IF NOT EXISTS "IX_Task_Task_CreatedAt" ON "Task"."Task" ("CreatedAt");
CREATE INDEX IF NOT EXISTS "IX_Task_Task_StatusId" ON "Task"."Task" ("StatusId");
CREATE INDEX IF NOT EXISTS "IX_Task_Task_AssignedToId" ON "Task"."Task" ("AssignedToId");
CREATE INDEX IF NOT EXISTS "IX_Task_Task_AssignedById" ON "Task"."Task" ("AssignedById");

-- Person
CREATE INDEX IF NOT EXISTS "IX_Person_Person_FirstName" ON "Person"."Person" ("FirstName");
CREATE INDEX IF NOT EXISTS "IX_Person_Person_LastName" ON "Person"."Person" ("LastName");
CREATE INDEX IF NOT EXISTS "IX_Person_Person_CI" ON "Person"."Person" ("CI");
CREATE INDEX IF NOT EXISTS "IX_Person_Person_Email" ON "Person"."Person" ("Email");
CREATE INDEX IF NOT EXISTS "IX_Person_Person_PhoneNumber" ON "Person"."Person" ("PhoneNumber");
CREATE INDEX IF NOT EXISTS "IX_Person_Person_Birthdate" ON "Person"."Person" ("Birthdate");
CREATE INDEX IF NOT EXISTS "IX_Person_Person_CreatedAt" ON "Person"."Person" ("CreatedAt");
CREATE INDEX IF NOT EXISTS "IX_Person_Person_UpdatedAt" ON "Person"."Person" ("UpdatedAt");
CREATE INDEX IF NOT EXISTS "IX_Person_Person_Active" ON "Person"."Person" ("Active");
CREATE INDEX IF NOT EXISTS "IX_Person_Person_GenderId" ON "Person"."Person" ("GenderId");
CREATE INDEX IF NOT EXISTS "IX_Person_Person_UserId" ON "Person"."Person" ("UserId");
CREATE INDEX IF NOT EXISTS "IX_Person_Person_CreatedById" ON "Person"."Person" ("CreatedById");
CREATE INDEX IF NOT EXISTS "IX_Person_Person_UpdatedById" ON "Person"."Person" ("UpdatedById");

-- Student
CREATE INDEX IF NOT EXISTS "IX_Student_Status_Description" ON "Student"."Status" ("Description");
CREATE INDEX IF NOT EXISTS "IX_Student_Student_CreatedAt" ON "Student"."Student" ("CreatedAt");
CREATE INDEX IF NOT EXISTS "IX_Student_Student_AcademicLevelId" ON "Student"."Student" ("AcademicLevelId");
CREATE INDEX IF NOT EXISTS "IX_Student_Student_PersonId" ON "Student"."Student" ("PersonId");
CREATE INDEX IF NOT EXISTS "IX_Student_Student_StudentStatusId" ON "Student"."Student" ("StudentStatusId");
CREATE INDEX IF NOT EXISTS "IX_Student_Student_AssignedById" ON "Student"."Student" ("AssignedById");
CREATE INDEX IF NOT EXISTS "IX_Student_Career_StudentId" ON "Student"."Career" ("StudentId");
CREATE INDEX IF NOT EXISTS "IX_Student_Career_CareerId" ON "Student"."Career" ("CareerId");

-- Record
CREATE INDEX IF NOT EXISTS "IX_Record_FolderStatus_Name" ON "Record"."FolderStatus" ("Name");
CREATE INDEX IF NOT EXISTS "IX_Record_FolderType_Name" ON "Record"."FolderType" ("Name");
CREATE INDEX IF NOT EXISTS "IX_Record_PhysicalLocation_Shelf" ON "Record"."PhysicalLocation" ("Shelf");
CREATE INDEX IF NOT EXISTS "IX_Record_PhysicalLocation_Box" ON "Record"."PhysicalLocation" ("Box");
CREATE INDEX IF NOT EXISTS "IX_Record_PhysicalLocation_Row" ON "Record"."PhysicalLocation" ("Row");
CREATE INDEX IF NOT EXISTS "IX_Record_PhysicalLocation_Capacity" ON "Record"."PhysicalLocation" ("Capacity");
CREATE INDEX IF NOT EXISTS "IX_Record_Folder_Description" ON "Record"."Folder" ("Description");
CREATE INDEX IF NOT EXISTS "IX_Record_Folder_CreatedAt" ON "Record"."Folder" ("CreatedAt");
CREATE INDEX IF NOT EXISTS "IX_Record_Folder_StudentId" ON "Record"."Folder" ("StudentId");
CREATE INDEX IF NOT EXISTS "IX_Record_Folder_FolderStatusId" ON "Record"."Folder" ("FolderStatusId");
CREATE INDEX IF NOT EXISTS "IX_Record_Folder_FolderTypeId" ON "Record"."Folder" ("FolderTypeId");
CREATE INDEX IF NOT EXISTS "IX_Record_Folder_PhysicalLocationId" ON "Record"."Folder" ("PhysicalLocationId");
CREATE INDEX IF NOT EXISTS "IX_Record_Folder_CreatedById" ON "Record"."Folder" ("CreatedById");
CREATE INDEX IF NOT EXISTS "IX_Record_Observation_Comment" ON "Record"."Observation" ("Comment");
CREATE INDEX IF NOT EXISTS "IX_Record_Observation_CreatedAt" ON "Record"."Observation" ("CreatedAt");
CREATE INDEX IF NOT EXISTS "IX_Record_Observation_IsResolved" ON "Record"."Observation" ("IsResolved");
CREATE INDEX IF NOT EXISTS "IX_Record_Observation_FolderId" ON "Record"."Observation" ("FolderId");
CREATE INDEX IF NOT EXISTS "IX_Record_Observation_DocumentId" ON "Record"."Observation" ("DocumentId");
CREATE INDEX IF NOT EXISTS "IX_Record_Observation_AuthorId" ON "Record"."Observation" ("AuthorId");

-- Document
CREATE INDEX IF NOT EXISTS "IX_Document_MimeType_Name" ON "Document"."MimeType" ("Name");
CREATE INDEX IF NOT EXISTS "IX_Document_Type_Name" ON "Document"."Type" ("Name");
CREATE INDEX IF NOT EXISTS "IX_Document_Type_IsMandatory" ON "Document"."Type" ("IsMandatory");
CREATE INDEX IF NOT EXISTS "IX_Document_Type_RequiredLevel" ON "Document"."Type" ("RequiredLevel");
CREATE INDEX IF NOT EXISTS "IX_Document_Document_Url" ON "Document"."Document" ("Url");
CREATE INDEX IF NOT EXISTS "IX_Document_Document_Name" ON "Document"."Document" ("Name");
CREATE INDEX IF NOT EXISTS "IX_Document_Document_Size" ON "Document"."Document" ("Size");
CREATE INDEX IF NOT EXISTS "IX_Document_Document_CreatedAt" ON "Document"."Document" ("CreatedAt");
CREATE INDEX IF NOT EXISTS "IX_Document_Document_UpdatedAt" ON "Document"."Document" ("UpdatedAt");
CREATE INDEX IF NOT EXISTS "IX_Document_Document_Active" ON "Document"."Document" ("Active");
CREATE INDEX IF NOT EXISTS "IX_Document_Document_FolderId" ON "Document"."Document" ("FolderId");
CREATE INDEX IF NOT EXISTS "IX_Document_Document_MimeTypeId" ON "Document"."Document" ("MimeTypeId");
CREATE INDEX IF NOT EXISTS "IX_Document_Document_DocumentTypeId" ON "Document"."Document" ("DocumentTypeId");
CREATE INDEX IF NOT EXISTS "IX_Document_Document_CreatedById" ON "Document"."Document" ("CreatedById");
CREATE INDEX IF NOT EXISTS "IX_Document_Document_UpdatedById" ON "Document"."Document" ("UpdatedById");

-- Request
CREATE INDEX IF NOT EXISTS "IX_Request_Status_Description" ON "Request"."Status" ("Description");
CREATE INDEX IF NOT EXISTS "IX_Request_Request_EmailContact" ON "Request"."Request" ("EmailContact");
CREATE INDEX IF NOT EXISTS "IX_Request_Request_TrackingCode" ON "Request"."Request" ("TrackingCode");
CREATE INDEX IF NOT EXISTS "IX_Request_Request_RequestAt" ON "Request"."Request" ("RequestAt");
CREATE INDEX IF NOT EXISTS "IX_Request_Request_StudentId" ON "Request"."Request" ("StudentId");
CREATE INDEX IF NOT EXISTS "IX_Request_Request_StatusRequestId" ON "Request"."Request" ("StatusRequestId");
CREATE INDEX IF NOT EXISTS "IX_Request_DocumentType_RequestId" ON "Request"."DocumentType" ("RequestId");
CREATE INDEX IF NOT EXISTS "IX_Request_DocumentType_DocumentTypeId" ON "Request"."DocumentType" ("DocumentTypeId");

-- Audit
CREATE INDEX IF NOT EXISTS "IX_Audit_Log_ActionDescription" ON "Audit"."Log" ("ActionDescription");
CREATE INDEX IF NOT EXISTS "IX_Audit_Log_EntityAffected" ON "Audit"."Log" ("EntityAffected");
CREATE INDEX IF NOT EXISTS "IX_Audit_Log_Details" ON "Audit"."Log" ("Details");
CREATE INDEX IF NOT EXISTS "IX_Audit_Log_IpAddress" ON "Audit"."Log" ("IpAddress");
CREATE INDEX IF NOT EXISTS "IX_Audit_Log_PersonId" ON "Audit"."Log" ("PersonId");

-- System
CREATE INDEX IF NOT EXISTS "IX_System_Setting_Value" ON "System"."Setting" ("Value");
CREATE INDEX IF NOT EXISTS "IX_System_Setting_Description" ON "System"."Setting" ("Description");

-- =============================================
-- SIDAE - Drop filter indexes by column
-- =============================================

-- General
DROP INDEX IF EXISTS "General"."IX_General_AcademicLevel_Name";
DROP INDEX IF EXISTS "General"."IX_General_Career_Name";

-- Security
DROP INDEX IF EXISTS "Security"."IX_Security_Action_Name";
DROP INDEX IF EXISTS "Security"."IX_Security_Endpoint_Name";
DROP INDEX IF EXISTS "Security"."IX_Security_Role_Name";
DROP INDEX IF EXISTS "Security"."IX_Security_User_Username";
DROP INDEX IF EXISTS "Security"."IX_Security_User_PasswordHash";
DROP INDEX IF EXISTS "Security"."IX_Security_User_Email";
DROP INDEX IF EXISTS "Security"."IX_Security_User_IsActive";
DROP INDEX IF EXISTS "Security"."IX_Security_User_RoleId";
DROP INDEX IF EXISTS "Security"."IX_Security_Permission_RoleId";
DROP INDEX IF EXISTS "Security"."IX_Security_Permission_ActionId";
DROP INDEX IF EXISTS "Security"."IX_Security_Permission_EndpointId";
DROP INDEX IF EXISTS "Security"."IX_Security_RoleUser_CreatedAt";
DROP INDEX IF EXISTS "Security"."IX_Security_RoleUser_Active";
DROP INDEX IF EXISTS "Security"."IX_Security_RoleUser_CreatedBy";
DROP INDEX IF EXISTS "Security"."IX_Security_RoleUser_RoleId";
DROP INDEX IF EXISTS "Security"."IX_Security_RoleUser_UserId";

-- Task
DROP INDEX IF EXISTS "Task"."IX_Task_Status_Name";
DROP INDEX IF EXISTS "Task"."IX_Task_Task_Title";
DROP INDEX IF EXISTS "Task"."IX_Task_Task_Description";
DROP INDEX IF EXISTS "Task"."IX_Task_Task_Capacity";
DROP INDEX IF EXISTS "Task"."IX_Task_Task_CreatedAt";
DROP INDEX IF EXISTS "Task"."IX_Task_Task_StatusId";
DROP INDEX IF EXISTS "Task"."IX_Task_Task_AssignedToId";
DROP INDEX IF EXISTS "Task"."IX_Task_Task_AssignedById";

-- Person
DROP INDEX IF EXISTS "Person"."IX_Person_Person_FirstName";
DROP INDEX IF EXISTS "Person"."IX_Person_Person_LastName";
DROP INDEX IF EXISTS "Person"."IX_Person_Person_CI";
DROP INDEX IF EXISTS "Person"."IX_Person_Person_Email";
DROP INDEX IF EXISTS "Person"."IX_Person_Person_PhoneNumber";
DROP INDEX IF EXISTS "Person"."IX_Person_Person_Birthdate";
DROP INDEX IF EXISTS "Person"."IX_Person_Person_CreatedAt";
DROP INDEX IF EXISTS "Person"."IX_Person_Person_UpdatedAt";
DROP INDEX IF EXISTS "Person"."IX_Person_Person_Active";
DROP INDEX IF EXISTS "Person"."IX_Person_Person_GenderId";
DROP INDEX IF EXISTS "Person"."IX_Person_Person_UserId";
DROP INDEX IF EXISTS "Person"."IX_Person_Person_CreatedById";
DROP INDEX IF EXISTS "Person"."IX_Person_Person_UpdatedById";

-- Student
DROP INDEX IF EXISTS "Student"."IX_Student_Status_Description";
DROP INDEX IF EXISTS "Student"."IX_Student_Student_CreatedAt";
DROP INDEX IF EXISTS "Student"."IX_Student_Student_AcademicLevelId";
DROP INDEX IF EXISTS "Student"."IX_Student_Student_PersonId";
DROP INDEX IF EXISTS "Student"."IX_Student_Student_StudentStatusId";
DROP INDEX IF EXISTS "Student"."IX_Student_Student_AssignedById";
DROP INDEX IF EXISTS "Student"."IX_Student_Career_StudentId";
DROP INDEX IF EXISTS "Student"."IX_Student_Career_CareerId";

-- Record
DROP INDEX IF EXISTS "Record"."IX_Record_FolderStatus_Name";
DROP INDEX IF EXISTS "Record"."IX_Record_FolderType_Name";
DROP INDEX IF EXISTS "Record"."IX_Record_PhysicalLocation_Shelf";
DROP INDEX IF EXISTS "Record"."IX_Record_PhysicalLocation_Box";
DROP INDEX IF EXISTS "Record"."IX_Record_PhysicalLocation_Row";
DROP INDEX IF EXISTS "Record"."IX_Record_PhysicalLocation_Capacity";
DROP INDEX IF EXISTS "Record"."IX_Record_Folder_Description";
DROP INDEX IF EXISTS "Record"."IX_Record_Folder_CreatedAt";
DROP INDEX IF EXISTS "Record"."IX_Record_Folder_StudentId";
DROP INDEX IF EXISTS "Record"."IX_Record_Folder_FolderStatusId";
DROP INDEX IF EXISTS "Record"."IX_Record_Folder_FolderTypeId";
DROP INDEX IF EXISTS "Record"."IX_Record_Folder_PhysicalLocationId";
DROP INDEX IF EXISTS "Record"."IX_Record_Folder_CreatedById";
DROP INDEX IF EXISTS "Record"."IX_Record_Observation_Comment";
DROP INDEX IF EXISTS "Record"."IX_Record_Observation_CreatedAt";
DROP INDEX IF EXISTS "Record"."IX_Record_Observation_IsResolved";
DROP INDEX IF EXISTS "Record"."IX_Record_Observation_FolderId";
DROP INDEX IF EXISTS "Record"."IX_Record_Observation_DocumentId";
DROP INDEX IF EXISTS "Record"."IX_Record_Observation_AuthorId";

-- Document
DROP INDEX IF EXISTS "Document"."IX_Document_MimeType_Name";
DROP INDEX IF EXISTS "Document"."IX_Document_Type_Name";
DROP INDEX IF EXISTS "Document"."IX_Document_Type_IsMandatory";
DROP INDEX IF EXISTS "Document"."IX_Document_Type_RequiredLevel";
DROP INDEX IF EXISTS "Document"."IX_Document_Document_Url";
DROP INDEX IF EXISTS "Document"."IX_Document_Document_Name";
DROP INDEX IF EXISTS "Document"."IX_Document_Document_Size";
DROP INDEX IF EXISTS "Document"."IX_Document_Document_CreatedAt";
DROP INDEX IF EXISTS "Document"."IX_Document_Document_UpdatedAt";
DROP INDEX IF EXISTS "Document"."IX_Document_Document_Active";
DROP INDEX IF EXISTS "Document"."IX_Document_Document_FolderId";
DROP INDEX IF EXISTS "Document"."IX_Document_Document_MimeTypeId";
DROP INDEX IF EXISTS "Document"."IX_Document_Document_DocumentTypeId";
DROP INDEX IF EXISTS "Document"."IX_Document_Document_CreatedById";
DROP INDEX IF EXISTS "Document"."IX_Document_Document_UpdatedById";

-- Request
DROP INDEX IF EXISTS "Request"."IX_Request_Status_Description";
DROP INDEX IF EXISTS "Request"."IX_Request_Request_EmailContact";
DROP INDEX IF EXISTS "Request"."IX_Request_Request_TrackingCode";
DROP INDEX IF EXISTS "Request"."IX_Request_Request_RequestAt";
DROP INDEX IF EXISTS "Request"."IX_Request_Request_StudentId";
DROP INDEX IF EXISTS "Request"."IX_Request_Request_StatusRequestId";
DROP INDEX IF EXISTS "Request"."IX_Request_DocumentType_RequestId";
DROP INDEX IF EXISTS "Request"."IX_Request_DocumentType_DocumentTypeId";

-- Audit
DROP INDEX IF EXISTS "Audit"."IX_Audit_Log_ActionDescription";
DROP INDEX IF EXISTS "Audit"."IX_Audit_Log_EntityAffected";
DROP INDEX IF EXISTS "Audit"."IX_Audit_Log_Details";
DROP INDEX IF EXISTS "Audit"."IX_Audit_Log_IpAddress";
DROP INDEX IF EXISTS "Audit"."IX_Audit_Log_PersonId";

-- System
DROP INDEX IF EXISTS "System"."IX_System_Setting_Value";
DROP INDEX IF EXISTS "System"."IX_System_Setting_Description";

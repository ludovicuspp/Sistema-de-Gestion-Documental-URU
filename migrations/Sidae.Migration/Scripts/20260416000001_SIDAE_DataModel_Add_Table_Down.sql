-- =============================================
-- Migration Down: SIDAE - Drop Data Model Tables
-- =============================================
-- Se eliminan en orden inverso de dependencias (CASCADE cubre FKs internas).

-- Request
DROP TABLE IF EXISTS "Request"."DocumentType"   CASCADE;
DROP TABLE IF EXISTS "Request"."Request"         CASCADE;
DROP TABLE IF EXISTS "Request"."Status"          CASCADE;

-- Audit
DROP TABLE IF EXISTS "Audit"."Log"               CASCADE;

-- System
DROP TABLE IF EXISTS "System"."Setting"          CASCADE;

-- Observations (depende de Document y Folder)
DROP TABLE IF EXISTS "Record"."Observation"      CASCADE;

-- Document
DROP TABLE IF EXISTS "Document"."Document"       CASCADE;
DROP TABLE IF EXISTS "Document"."Type"           CASCADE;
DROP TABLE IF EXISTS "Document"."MimeType"       CASCADE;

-- Record
DROP TABLE IF EXISTS "Record"."Folder"           CASCADE;
DROP TABLE IF EXISTS "Record"."PhysicalLocation" CASCADE;
DROP TABLE IF EXISTS "Record"."FolderType"       CASCADE;
DROP TABLE IF EXISTS "Record"."FolderStatus"     CASCADE;

-- Student
DROP TABLE IF EXISTS "Student"."Career"          CASCADE;
DROP TABLE IF EXISTS "Student"."Student"         CASCADE;
DROP TABLE IF EXISTS "Student"."Status"          CASCADE;

-- Person
DROP TABLE IF EXISTS "Person"."Person"           CASCADE;

-- Task
DROP TABLE IF EXISTS "Task"."Task"               CASCADE;
DROP TABLE IF EXISTS "Task"."Status"             CASCADE;

-- Security
DROP TABLE IF EXISTS "Security"."RoleUser"       CASCADE;
DROP TABLE IF EXISTS "Security"."Permission"     CASCADE;
DROP TABLE IF EXISTS "Security"."User"           CASCADE;
DROP TABLE IF EXISTS "Security"."Role"           CASCADE;
DROP TABLE IF EXISTS "Security"."Endpoint"       CASCADE;
DROP TABLE IF EXISTS "Security"."Action"         CASCADE;

-- General
DROP TABLE IF EXISTS "General"."Career"          CASCADE;
DROP TABLE IF EXISTS "General"."AcademicLevel"   CASCADE;

-- Schemas
DROP SCHEMA IF EXISTS "System"   CASCADE;
DROP SCHEMA IF EXISTS "Audit"    CASCADE;
DROP SCHEMA IF EXISTS "Request"  CASCADE;
DROP SCHEMA IF EXISTS "Document" CASCADE;
DROP SCHEMA IF EXISTS "Record"   CASCADE;
DROP SCHEMA IF EXISTS "Student"  CASCADE;
DROP SCHEMA IF EXISTS "Person"   CASCADE;
DROP SCHEMA IF EXISTS "Task"     CASCADE;
DROP SCHEMA IF EXISTS "Security" CASCADE;
DROP SCHEMA IF EXISTS "General"  CASCADE;

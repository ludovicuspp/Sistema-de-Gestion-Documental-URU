package com.cid.sidae.migration;

import com.cid.sidae.migration.MigrationDataSources.TargetDatabases;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * ETL de un solo uso legado (.NET/FluentMigrator) -> esquema Spring/Flyway.
 * Idempotente por guid_id: re-ejecutable sin duplicar. Ver docs/migracion-legado.md.
 */
@Component
public class LegacyMigrationRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(LegacyMigrationRunner.class);

    private final JdbcTemplate legacy;
    private final TargetDatabases targets;
    private final String manifestPath;

    public LegacyMigrationRunner(
            JdbcTemplate legacyJdbcTemplate,
            TargetDatabases targetDatabases,
            @Value("${migration.manifest-path:./files-manifest.csv}") String manifestPath) {
        this.legacy = legacyJdbcTemplate;
        this.targets = targetDatabases;
        this.manifestPath = manifestPath;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        MigrationReport report = new MigrationReport();
        List<String> manifest = new ArrayList<>();
        manifest.add("guid,original_url,stored_filename");

        Map<String, Integer> levels = migrateLevels(report);
        Map<String, Integer> careers = migrateCareers(report);
        migrateMimeTypes(report);
        Map<Integer, Integer> docTypeIds = migrateDocumentTypes(report, levels);
        Map<String, Integer> roles = loadRoles(report);
        Map<Integer, Integer> userIds = migrateUsers(report, roles);
        Map<Integer, UUID> studentGuids = migrateStudents(report, levels, careers);
        Map<Integer, UUID> folderGuids = migrateFolders(report, studentGuids, userIds);
        migrateDocuments(report, folderGuids, docTypeIds, userIds, manifest);
        migrateObservations(report, folderGuids, userIds);
        migrateRequests(report, studentGuids, docTypeIds);
        migrateTasks(report, userIds);

        Files.writeString(Path.of(manifestPath), String.join("\n", manifest), StandardCharsets.UTF_8);

        log.info("=== Migracion finalizada ===");
        for (MigrationReport.TableReport table : report.tables()) {
            log.info("{}: insertados={} omitidos={} errores={}", table.table(), table.inserted(),
                    table.skipped(), table.errors().size());
            table.errors().stream().limit(20).forEach(detail -> log.warn("  - {}", detail));
        }
        report.warnings().forEach(warning -> log.warn("Aviso: {}", warning));
        if (report.totalErrors() > 0) {
            throw new IllegalStateException(
                    "Migracion con " + report.totalErrors() + " errores. Corrija y re-ejecute (es idempotente).");
        }
    }

    // ------------------------------------------------------------------ catalogo

    private Map<String, Integer> migrateLevels(MigrationReport report) {
        JdbcTemplate catalog = targets.get("catalog");
        Map<String, Integer> ids = new LinkedHashMap<>();
        for (Map<String, Object> row : legacy.queryForList(
                "SELECT \"Id\", \"Name\" FROM \"General\".\"AcademicLevel\" ORDER BY \"Id\"")) {
            String name = (String) row.get("Name");
            Integer id = catalog.query(
                    "SELECT id FROM academic_levels WHERE name = ?",
                    (rs, n) -> rs.getInt("id"), name).stream().findFirst().orElse(null);
            if (id == null) {
                id = catalog.queryForObject(
                        "INSERT INTO academic_levels (name, active) VALUES (?, TRUE) RETURNING id",
                        Integer.class, name);
                report.inserted("catalog.academic_levels");
            } else {
                report.skipped("catalog.academic_levels");
            }
            ids.put(name, id);
        }
        return ids;
    }

    private Map<String, Integer> migrateCareers(MigrationReport report) {
        JdbcTemplate catalog = targets.get("catalog");
        List<Map<String, Object>> existing = catalog.queryForList("SELECT id, name FROM careers");
        Map<String, Integer> byNormalized = new LinkedHashMap<>();
        for (Map<String, Object> row : existing) {
            byNormalized.put(LegacyMappings.normalized((String) row.get("name")), (Integer) row.get("id"));
        }
        Map<String, Integer> ids = new LinkedHashMap<>();
        for (Map<String, Object> row : legacy.queryForList(
                "SELECT \"Id\", \"Name\" FROM \"General\".\"Career\" ORDER BY \"Id\"")) {
            String name = (String) row.get("Name");
            Integer id = byNormalized.get(LegacyMappings.normalized(name));
            if (id == null) {
                id = catalog.queryForObject(
                        "INSERT INTO careers (name, code, active) VALUES (?, NULL, TRUE) RETURNING id",
                        Integer.class, name);
                byNormalized.put(LegacyMappings.normalized(name), id);
                report.inserted("catalog.careers");
            } else {
                report.skipped("catalog.careers");
            }
            ids.put(name, id);
        }
        return ids;
    }

    private void migrateMimeTypes(MigrationReport report) {
        JdbcTemplate catalog = targets.get("catalog");
        for (Map<String, Object> row : legacy.queryForList(
                "SELECT \"Id\", \"Name\" FROM \"Document\".\"MimeType\" ORDER BY \"Id\"")) {
            String name = (String) row.get("Name");
            Integer existing = firstOrNull(catalog,
                    "SELECT id FROM mime_types WHERE name = ?", name);
            if (existing != null) {
                report.skipped("catalog.mime_types");
                continue;
            }
            String extension = name.contains("/") ? name.substring(name.lastIndexOf('/') + 1) : name;
            if (!extension.matches("[a-z0-9]{1,10}")) {
                extension = "bin";
            }
            catalog.update("INSERT INTO mime_types (name, extension, active) VALUES (?, ?, TRUE)", name, extension);
            report.inserted("catalog.mime_types");
        }
    }

    private Map<Integer, Integer> migrateDocumentTypes(MigrationReport report, Map<String, Integer> levels) {
        JdbcTemplate catalog = targets.get("catalog");
        List<Map<String, Object>> existing = catalog.queryForList("SELECT id, name FROM document_types");
        Map<String, Integer> byNormalized = new LinkedHashMap<>();
        for (Map<String, Object> row : existing) {
            byNormalized.put(LegacyMappings.normalized((String) row.get("name")), (Integer) row.get("id"));
        }
        Map<Integer, List<Integer>> typeLevels = new LinkedHashMap<>();
        for (Map<String, Object> row : legacy.queryForList(
                "SELECT \"DocumentTypeId\", \"AcademicLevelId\" FROM \"Document\".\"TypeAcademicLevel\" ORDER BY \"DocumentTypeId\"")) {
            typeLevels.computeIfAbsent((Integer) row.get("DocumentTypeId"), key -> new ArrayList<>())
                    .add((Integer) row.get("AcademicLevelId"));
        }
        Map<Integer, String> legacyLevels = new LinkedHashMap<>();
        for (Map<String, Object> row : legacy.queryForList("SELECT \"Id\", \"Name\" FROM \"General\".\"AcademicLevel\"")) {
            legacyLevels.put((Integer) row.get("Id"), (String) row.get("Name"));
        }
        Map<Integer, Integer> ids = new LinkedHashMap<>();
        for (Map<String, Object> row : legacy.queryForList(
                "SELECT \"Id\", \"Name\", \"IsRequired\" FROM \"Document\".\"Type\" ORDER BY \"Id\"")) {
            Integer legacyId = (Integer) row.get("Id");
            String name = (String) row.get("Name");
            Integer existingId = byNormalized.get(LegacyMappings.normalized(name));
            if (existingId != null) {
                ids.put(legacyId, existingId);
                report.skipped("catalog.document_types");
                continue;
            }
            Integer academicLevelId = null;
            List<Integer> linked = typeLevels.getOrDefault(legacyId, List.of());
            if (!linked.isEmpty()) {
                String levelName = legacyLevels.get(linked.stream().sorted().findFirst().orElseThrow());
                academicLevelId = levelName == null ? null : levels.get(levelName);
                if (linked.size() > 1) {
                    report.warn("Tipo de documento '" + name + "' tenia " + linked.size()
                            + " niveles; se conserva " + levelName + ".");
                }
            }
            Integer id = catalog.queryForObject(
                    "INSERT INTO document_types (name, is_required, academic_level_id, active, created_at) VALUES (?, ?, ?, TRUE, now()) RETURNING id",
                    Integer.class, name, row.get("IsRequired"), academicLevelId);
            byNormalized.put(LegacyMappings.normalized(name), id);
            ids.put(legacyId, id);
            report.inserted("catalog.document_types");
        }
        return ids;
    }

    // ------------------------------------------------------------------ auth

    private Map<String, Integer> loadRoles(MigrationReport report) {
        JdbcTemplate auth = targets.get("auth");
        Map<String, Integer> roles = new LinkedHashMap<>();
        for (Map<String, Object> row : auth.queryForList("SELECT id, name FROM roles")) {
            roles.put((String) row.get("name"), (Integer) row.get("id"));
        }
        log.info("Roles destino: {}", roles.keySet());
        return roles;
    }

    private Map<Integer, Integer> migrateUsers(MigrationReport report, Map<String, Integer> roles) {
        JdbcTemplate auth = targets.get("auth");
        Map<Integer, String> legacyRoles = new LinkedHashMap<>();
        for (Map<String, Object> row : legacy.queryForList("SELECT \"Id\", \"Name\" FROM \"Security\".\"Role\"")) {
            legacyRoles.put((Integer) row.get("Id"), (String) row.get("Name"));
        }
        Map<Integer, Integer> ids = new LinkedHashMap<>();
        for (Map<String, Object> row : legacy.queryForList(
                "SELECT \"Id\", \"GuidId\", \"Username\", \"Email\", \"PasswordHash\", \"IsActive\", \"RoleId\" FROM \"Security\".\"User\" ORDER BY \"Id\"")) {
            Integer legacyId = (Integer) row.get("Id");
            UUID guid = (UUID) row.get("GuidId");
            Integer existing = findByGuid(auth, "users", guid);
            if (existing != null) {
                ids.put(legacyId, existing);
                report.skipped("auth.users");
                continue;
            }
            String roleName = legacyRoles.get(row.get("RoleId"));
            Integer roleId = roleName == null ? null : roles.get(roleName);
            if (roleId == null) {
                report.error("auth.users", "Usuario " + row.get("Email") + ": rol inexistente '" + roleName + "'.");
                continue;
            }
            Integer id = auth.queryForObject(
                    "INSERT INTO users (guid_id, username, email, password_hash, is_active, role_id, created_at) VALUES (?, ?, ?, ?, ?, ?, now()) RETURNING id",
                    Integer.class, guid, row.get("Username"), row.get("Email"), row.get("PasswordHash"),
                    row.get("IsActive"), roleId);
            ids.put(legacyId, id);
            report.inserted("auth.users");
        }
        return ids;
    }

    // ------------------------------------------------------------------ students

    private Map<Integer, UUID> migrateStudents(MigrationReport report, Map<String, Integer> levels,
            Map<String, Integer> careersByName) {
        JdbcTemplate target = targets.get("students");
        Map<Integer, UUID> guids = new LinkedHashMap<>();
        List<Map<String, Object>> rows = legacy.queryForList("""
                SELECT s."Id", s."GuidId", p."CI", p."FirstName", p."LastName", p."Email",
                       p."PhoneNumber", p."Birthdate", p."Active",
                       st."Name" AS status_name, l."Name" AS level_name
                FROM "Student"."Student" s
                JOIN "Person"."Person" p ON p."Id" = s."PersonId"
                JOIN "Student"."Status" st ON st."Id" = s."StudentStatusId"
                JOIN "General"."AcademicLevel" l ON l."Id" = s."AcademicLevelId"
                ORDER BY s."Id\"""");
        for (Map<String, Object> row : rows) {
            Integer legacyId = (Integer) row.get("Id");
            UUID guid = (UUID) row.get("GuidId");
            guids.put(legacyId, guid);
            Integer existing = findByGuid(target, "students", guid);
            if (existing != null) {
                report.skipped("students.students");
                continue;
            }
            String ci = str(row.get("CI"));
            String firstName = str(row.get("FirstName"));
            String lastName = str(row.get("LastName"));
            if (ci.isBlank() || firstName.isBlank() || lastName.isBlank()
                    || ci.length() > 20 || firstName.length() > 100 || lastName.length() > 100) {
                report.error("students.students", "Estudiante legado " + legacyId + ": datos basicos invalidos.");
                continue;
            }
            String email = emptyToNull(str(row.get("Email")));
            if (email != null && (email.length() > 120 || !email.contains("@"))) {
                report.error("students.students", "Estudiante " + ci + ": email invalido.");
                continue;
            }
            String phone = emptyToNull(str(row.get("PhoneNumber")));
            if (phone != null && phone.length() > 30) {
                phone = phone.substring(0, 30);
                report.warn("Telefono truncado para CI " + ci + ".");
            }
            Integer careerId = firstCareerId((Integer) row.get("Id"), careersByName, report, ci);
            try {
                target.queryForObject(
                        "INSERT INTO students (guid_id, ci, first_name, last_name, email, phone, birthdate, career_id, academic_level_id, status, type, active, created_at)"
                                + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now()) RETURNING id",
                        Integer.class,
                        guid, ci, firstName, lastName, email, phone, toLocalDate(row.get("Birthdate")),
                        careerId, levels.get(row.get("level_name")),
                        LegacyMappings.upper((String) row.get("status_name")),
                        LegacyMappings.folderTypeFromLevel((String) row.get("level_name")),
                        row.get("Active"));
                report.inserted("students.students");
            } catch (Exception ex) {
                report.error("students.students", "CI " + ci + ": " + rootMessage(ex));
            }
        }
        return guids;
    }

    private Integer firstCareerId(Integer legacyStudentId, Map<String, Integer> careersByName,
            MigrationReport report, String ci) {
        List<Map<String, Object>> links = legacy.queryForList(
                "SELECT c.\"Name\" FROM \"Student\".\"Career\" sc"
                        + " JOIN \"General\".\"Career\" c ON c.\"Id\" = sc.\"CareerId\""
                        + " WHERE sc.\"StudentId\" = ? ORDER BY sc.\"Id\"",
                legacyStudentId);
        if (links.isEmpty()) {
            return null;
        }
        if (links.size() > 1) {
            report.warn("Estudiante " + ci + " tenia " + links.size() + " carreras; se conserva la primera.");
        }
        return careersByName.get(LegacyMappings.normalized((String) links.get(0).get("Name")));
    }

    // ------------------------------------------------------------------ records

    private Map<Integer, UUID> migrateFolders(MigrationReport report, Map<Integer, UUID> studentGuids,
            Map<Integer, Integer> userIds) {
        JdbcTemplate target = targets.get("records");
        Map<Integer, UUID> guids = new LinkedHashMap<>();
        Map<Integer, Integer> studentNewIds = resolveNewIds(targets.get("students"), "students", studentGuids);
        List<Map<String, Object>> rows = legacy.queryForList("""
                SELECT f."Id", f."GuidId", f."Description", f."CreatedAt",
                       s."GuidId" AS student_guid, p."CI" AS student_ci,
                       (p."FirstName" || ' ' || p."LastName") AS student_name,
                       fs."Name" AS status_name, ft."Name" AS type_name, l."Name" AS level_name,
                       pl."Shelf", pl."Box", pl."Row", f."CreatedById"
                FROM "Record"."Folder" f
                JOIN "Student"."Student" s ON s."Id" = f."StudentId"
                JOIN "Person"."Person" p ON p."Id" = s."PersonId"
                JOIN "Record"."FolderStatus" fs ON fs."Id" = f."FolderStatusId"
                JOIN "Record"."FolderType" ft ON ft."Id" = f."FolderTypeId"
                JOIN "General"."AcademicLevel" l ON l."Id" = s."AcademicLevelId"
                LEFT JOIN "Record"."PhysicalLocation" pl ON pl."Id" = f."PhysicalLocationId"
                ORDER BY f."Id\"""");
        for (Map<String, Object> row : rows) {
            Integer legacyId = (Integer) row.get("Id");
            UUID guid = (UUID) row.get("GuidId");
            guids.put(legacyId, guid);
            if (findByGuid(target, "record_folders", guid) != null) {
                report.skipped("records.record_folders");
                continue;
            }
            Integer studentId = studentNewIds.get(row.get("student_guid"));
            if (studentId == null) {
                report.error("records.record_folders", "Expediente " + guid + ": estudiante no migrado.");
                continue;
            }
            String description = str(row.get("Description"));
            if (!"".equals(str(row.get("type_name")))) {
                String suffix = "[Tipo legajo: " + row.get("type_name") + "]";
                description = description.isBlank() ? suffix : description + " " + suffix;
            }
            try {
                target.queryForObject(
                        "INSERT INTO record_folders (guid_id, description, student_id, student_ci, student_name,"
                                + " folder_type, status, shelf, box, row_number, created_by_id, created_by_name,"
                                + " created_at, updated_at, active)"
                                + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, NULL, TRUE) RETURNING id",
                        Integer.class,
                        guid, emptyToNull(description), studentId, row.get("student_ci"), row.get("student_name"),
                        LegacyMappings.folderTypeFromLevel((String) row.get("level_name")),
                        LegacyMappings.folderStatus((String) row.get("status_name")),
                        emptyToNull(str(row.get("Shelf"))), emptyToNull(str(row.get("Box"))),
                        emptyToNull(str(row.get("Row"))),
                        userIds.get(row.get("CreatedById")), instant(row.get("CreatedAt")));
                report.inserted("records.record_folders");
            } catch (Exception ex) {
                report.error("records.record_folders", "Expediente " + guid + ": " + rootMessage(ex));
            }
        }
        return guids;
    }

    private void migrateDocuments(MigrationReport report, Map<Integer, UUID> folderGuids,
            Map<Integer, Integer> docTypeIds, Map<Integer, Integer> userIds, List<String> manifest) {
        JdbcTemplate target = targets.get("records");
        Map<Integer, Integer> folderNewIds = resolveNewIds(target, "record_folders", folderGuids);
        List<Map<String, Object>> rows = legacy.queryForList("""
                SELECT d."Id", d."GuidId", d."Url", d."Name", d."Size", d."CreatedAt", d."Active",
                       fo."GuidId" AS folder_guid, d."DocumentTypeId", m."Name" AS mime_name, d."CreatedById"
                FROM "Document"."Document" d
                JOIN "Record"."Folder" fo ON fo."Id" = d."FolderId"
                LEFT JOIN "Document"."Type" t ON t."Id" = d."DocumentTypeId"
                LEFT JOIN "Document"."MimeType" m ON m."Id" = d."MimeTypeId"
                ORDER BY d."Id\"""");
        for (Map<String, Object> row : rows) {
            UUID guid = (UUID) row.get("GuidId");
            if (findByGuid(target, "document_entries", guid) != null) {
                report.skipped("records.document_entries");
                continue;
            }
            Integer folderId = folderNewIds.get(row.get("folder_guid"));
            if (folderId == null) {
                report.error("records.document_entries", "Documento " + guid + ": expediente no migrado.");
                continue;
            }
            String storedName = LegacyMappings.fileNameOf((String) row.get("Url"));
            String contentType = str(row.get("mime_name")).contains("/")
                    ? str(row.get("mime_name"))
                    : LegacyMappings.contentTypeOf(storedName);
            manifest.add(guid + "," + row.get("Url") + "," + storedName);
            try {
                target.queryForObject(
                        "INSERT INTO document_entries (guid_id, folder_id, name, stored_path, content_type,"
                                + " file_size, document_type_id, created_by_id, created_at, active)"
                                + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id",
                        Integer.class,
                        guid, folderId, row.get("Name"), storedName, contentType, row.get("Size"),
                        row.get("DocumentTypeId") == null ? null : docTypeIds.get(row.get("DocumentTypeId")),
                        userIds.get(row.get("CreatedById")), instant(row.get("CreatedAt")), row.get("Active"));
                report.inserted("records.document_entries");
            } catch (Exception ex) {
                report.error("records.document_entries", "Documento " + guid + ": " + rootMessage(ex));
            }
        }
    }

    private void migrateObservations(MigrationReport report, Map<Integer, UUID> folderGuids,
            Map<Integer, Integer> userIds) {
        JdbcTemplate target = targets.get("records");
        Map<Integer, Integer> folderNewIds = resolveNewIds(target, "record_folders", folderGuids);
        Map<Integer, String> usernames = legacyUsernames();
        List<Map<String, Object>> rows = legacy.queryForList("""
                SELECT o."Id", o."GuidId", o."Comment", o."CreatedAt", fo."GuidId" AS folder_guid,
                       doc."GuidId" AS document_guid, o."AuthorId"
                FROM "Record"."Observation" o
                JOIN "Record"."Folder" fo ON fo."Id" = o."FolderId"
                LEFT JOIN "Document"."Document" doc ON doc."Id" = o."DocumentId"
                ORDER BY o."Id\"""");
        for (Map<String, Object> row : rows) {
            UUID guid = (UUID) row.get("GuidId");
            if (findByGuid(target, "record_observations", guid) != null) {
                report.skipped("records.record_observations");
                continue;
            }
            Integer folderId = folderNewIds.get(row.get("folder_guid"));
            if (folderId == null) {
                report.error("records.record_observations", "Observacion " + guid + ": expediente no migrado.");
                continue;
            }
            Integer documentId = row.get("document_guid") == null ? null
                    : findByGuid(target, "document_entries", (UUID) row.get("document_guid"));
            String content = str(row.get("Comment"));
            if (content.length() > 1000) {
                content = content.substring(0, 997) + "...";
                report.warn("Observacion " + guid + " truncada a 1000 caracteres.");
            }
            try {
                target.queryForObject(
                        "INSERT INTO record_observations (guid_id, folder_id, document_id, content, author_id, author_name, created_at)"
                                + " VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id",
                        Integer.class,
                        guid, folderId, documentId, content,
                        userIds.get(row.get("AuthorId")),
                        usernames.get(row.get("AuthorId")),
                        instant(row.get("CreatedAt")));
                report.inserted("records.record_observations");
            } catch (Exception ex) {
                report.error("records.record_observations", "Observacion " + guid + ": " + rootMessage(ex));
            }
        }
    }

    // ------------------------------------------------------------------ requests

    private void migrateRequests(MigrationReport report, Map<Integer, UUID> studentGuids,
            Map<Integer, Integer> docTypeIds) {
        JdbcTemplate target = targets.get("requests");
        Map<Integer, String> typeNames = new LinkedHashMap<>();
        for (Map<String, Object> row : legacy.queryForList("SELECT \"Id\", \"Name\" FROM \"Document\".\"Type\"")) {
            typeNames.put((Integer) row.get("Id"), (String) row.get("Name"));
        }
        List<Map<String, Object>> rows = legacy.queryForList("""
                SELECT r."Id", r."GuidId", r."EmailContact", r."TrackingCode", r."RequestAt",
                       rs."Name" AS status_name, s."GuidId" AS student_guid,
                       p."CI" AS student_ci, (p."FirstName" || ' ' || p."LastName") AS student_name,
                       p."Email" AS student_email
                FROM "Request"."Request" r
                JOIN "Request"."Status" rs ON rs."Id" = r."StatusRequestId"
                LEFT JOIN "Student"."Student" s ON s."Id" = r."StudentId"
                LEFT JOIN "Person"."Person" p ON p."Id" = s."PersonId"
                ORDER BY r."Id\"""");
        for (Map<String, Object> row : rows) {
            UUID guid = (UUID) row.get("GuidId");
            if (findByGuid(target, "requests", guid) != null) {
                report.skipped("requests.requests");
                continue;
            }
            String tracking = str(row.get("TrackingCode"));
            if (tracking.isBlank() || tracking.length() > 20) {
                tracking = "CID-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                report.warn("Solicitud " + guid + ": tracking regenerado.");
            }
            String fullName = str(row.get("student_name")).isBlank() ? "Solicitante" : str(row.get("student_name"));
            String email = str(row.get("EmailContact")).isBlank() ? str(row.get("student_email")) : str(row.get("EmailContact"));
            try {
                Integer requestId = target.queryForObject(
                        "INSERT INTO requests (guid_id, tracking_code, ci, full_name, email, phone, comment,"
                                + " status, created_at, updated_at)"
                                + " VALUES (?, ?, ?, ?, ?, NULL, NULL, ?, ?, NULL) RETURNING id",
                        Integer.class,
                        guid, tracking,
                        str(row.get("student_ci")).isBlank() ? "S/N" : str(row.get("student_ci")),
                        fullName, email,
                        LegacyMappings.requestStatus((String) row.get("status_name")),
                        instant(row.get("RequestAt")));
                for (Map<String, Object> doc : legacy.queryForList(
                        "SELECT \"DocumentTypeId\" FROM \"Request\".\"DocumentType\" WHERE \"RequestId\" = ?",
                        row.get("Id"))) {
                    Integer legacyTypeId = (Integer) doc.get("DocumentTypeId");
                    target.update("INSERT INTO request_documents (request_id, document_type_id, document_name) VALUES (?, ?, ?)",
                            requestId, docTypeIds.get(legacyTypeId), typeNames.getOrDefault(legacyTypeId, "Documento"));
                }
                report.inserted("requests.requests");
            } catch (Exception ex) {
                report.error("requests.requests", "Solicitud " + guid + ": " + rootMessage(ex));
            }
        }
    }

    // ------------------------------------------------------------------ tasks

    private void migrateTasks(MigrationReport report, Map<Integer, Integer> userIds) {
        JdbcTemplate target = targets.get("tasks");
        Map<Integer, String> usernames = legacyUsernames();
        List<Map<String, Object>> rows = legacy.queryForList("""
                SELECT t."Id", t."GuidId", t."Title", t."Description", t."CreatedAt",
                       st."Name" AS status_name, t."AssignedToId", t."AssignedById"
                FROM "Task"."Task" t
                JOIN "Task"."Status" st ON st."Id" = t."StatusId"
                ORDER BY t."Id\"""");
        for (Map<String, Object> row : rows) {
            UUID guid = (UUID) row.get("GuidId");
            if (findByGuid(target, "tasks", guid) != null) {
                report.skipped("tasks.tasks");
                continue;
            }
            try {
                target.queryForObject(
                        "INSERT INTO tasks (guid_id, title, description, detail, assigned_to_id, assigned_to_name,"
                                + " due_date, status, created_by_id, created_by_name, created_at, updated_at)"
                                + " VALUES (?, ?, ?, NULL, ?, ?, NULL, ?, ?, ?, ?, NULL) RETURNING id",
                        Integer.class,
                        guid, row.get("Title"), row.get("Description"),
                        userIds.get(row.get("AssignedToId")),
                        assignedName(row.get("AssignedToId"), usernames),
                        LegacyMappings.taskStatus((String) row.get("status_name")),
                        userIds.get(row.get("AssignedById")),
                        createdByName(row.get("AssignedById"), usernames),
                        instant(row.get("CreatedAt")));
                report.inserted("tasks.tasks");
            } catch (Exception ex) {
                report.error("tasks.tasks", "Tarea " + guid + ": " + rootMessage(ex));
            }
        }
    }

    // ------------------------------------------------------------------ helpers

    private Map<Integer, String> legacyUsernames() {
        Map<Integer, String> names = new LinkedHashMap<>();
        for (Map<String, Object> row : legacy.queryForList("SELECT \"Id\", \"Username\" FROM \"Security\".\"User\"")) {
            names.put((Integer) row.get("Id"), (String) row.get("Username"));
        }
        return names;
    }

    private String assignedName(Object legacyUserId, Map<Integer, String> usernames) {
        if (legacyUserId == null) {
            return null;
        }
        return usernames.get(legacyUserId);
    }

    private String createdByName(Object legacyUserId, Map<Integer, String> usernames) {
        if (legacyUserId == null) {
            return "migracion";
        }
        String name = usernames.get(legacyUserId);
        return name == null ? "migracion" : name;
    }

    private Integer firstOrNull(JdbcTemplate tpl, String sql, Object... args) {
        try {
            return tpl.queryForObject(sql, Integer.class, args);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    private Integer findByGuid(JdbcTemplate tpl, String table, UUID guid) {        try {
            return tpl.queryForObject("SELECT id FROM " + table + " WHERE guid_id = ?", Integer.class, guid);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    private Map<Integer, Integer> resolveNewIds(JdbcTemplate tpl, String table, Map<Integer, UUID> legacyGuids) {
        Map<Integer, Integer> ids = new LinkedHashMap<>();
        for (Map.Entry<Integer, UUID> entry : legacyGuids.entrySet()) {
            Integer id = findByGuid(tpl, table, entry.getValue());
            if (id != null) {
                ids.put(entry.getKey(), id);
            }
        }
        return ids;
    }

    private static String str(Object value) {
        return value == null ? "" : value.toString().trim();
    }

    private static String emptyToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }

    private static Instant instant(Object value) {
        if (value == null) {
            return Instant.now();
        }
        if (value instanceof Timestamp timestamp) {
            return timestamp.toInstant();
        }
        return Instant.now();
    }

    private static java.time.LocalDate toLocalDate(Object value) {
        if (value instanceof java.sql.Date date) {
            return date.toLocalDate();
        }
        if (value instanceof Timestamp timestamp) {
            return timestamp.toLocalDateTime().toLocalDate();
        }
        return null;
    }

    private static String rootMessage(Exception ex) {
        Throwable cause = ex;
        while (cause.getCause() != null && cause.getCause() != cause) {
            cause = cause.getCause();
        }
        String message = cause.getMessage();
        return message == null ? ex.getClass().getSimpleName()
                : message.substring(0, Math.min(message.length(), 200));
    }
}

package com.cid.sidae.records.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "record_folders")
public class RecordFolder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "guid_id", nullable = false, unique = true)
    private UUID guidId;

    @Column(length = 500)
    private String description;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "student_ci", nullable = false, length = 20)
    private String studentCi;

    @Column(name = "student_name", nullable = false, length = 200)
    private String studentName;

    @Column(name = "folder_type", nullable = false, length = 20)
    private String folderType = "PREGRADO";

    @Column(nullable = false, length = 20)
    private String status = "PENDIENTE";

    @Column(length = 50)
    private String shelf;

    @Column(length = 50)
    private String box;

    @Column(name = "row_number", length = 50)
    private String rowNumber;

    @Column(name = "created_by_id")
    private Long createdById;

    @Column(name = "created_by_name", length = 150)
    private String createdByName;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(nullable = false)
    private boolean active = true;

    public Long getId() {
        return id;
    }

    public UUID getGuidId() {
        return guidId;
    }

    public void setGuidId(UUID guidId) {
        this.guidId = guidId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentCi() {
        return studentCi;
    }

    public void setStudentCi(String studentCi) {
        this.studentCi = studentCi;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getFolderType() {
        return folderType;
    }

    public void setFolderType(String folderType) {
        this.folderType = folderType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getShelf() {
        return shelf;
    }

    public void setShelf(String shelf) {
        this.shelf = shelf;
    }

    public String getBox() {
        return box;
    }

    public void setBox(String box) {
        this.box = box;
    }

    public String getRowNumber() {
        return rowNumber;
    }

    public void setRowNumber(String rowNumber) {
        this.rowNumber = rowNumber;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

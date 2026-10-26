package com.cid.sidae.reports.export;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Map;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;

class ExcelExporterTest {

    @Test
    void exportProducesReadableWorkbook() throws Exception {
        List<ReportColumn> columns = List.of(
                new ReportColumn("CI", row -> ReportColumn.text(row.get("ci"))),
                new ReportColumn("Nombre", row -> ReportColumn.text(row.get("name"))));
        List<Map<String, Object>> rows = List.of(
                Map.of("ci", "V123", "name", "Ana Perez"),
                Map.of("ci", "V456", "name", "Luis Gomez"));

        byte[] bytes = ExcelExporter.export("Estudiantes", columns, rows);

        assertThat(bytes).isNotEmpty();
        try (Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(bytes))) {
            Sheet sheet = workbook.getSheet("Estudiantes");
            assertThat(sheet).isNotNull();
            Row header = sheet.getRow(0);
            assertThat(header.getCell(0).getStringCellValue()).isEqualTo("CI");
            assertThat(header.getCell(1).getStringCellValue()).isEqualTo("Nombre");
            assertThat(sheet.getRow(1).getCell(0).getStringCellValue()).isEqualTo("V123");
            assertThat(sheet.getRow(2).getCell(1).getStringCellValue()).isEqualTo("Luis Gomez");
            assertThat(sheet.getLastRowNum()).isEqualTo(2);
        }
    }

    @Test
    void exportHandlesEmptyRows() {
        byte[] bytes = ExcelExporter.export("Vacio",
                List.of(new ReportColumn("CI", row -> ReportColumn.text(row.get("ci")))),
                List.of());

        assertThat(bytes).isNotEmpty();
    }
}


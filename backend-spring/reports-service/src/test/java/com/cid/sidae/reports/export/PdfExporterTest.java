package com.cid.sidae.reports.export;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class PdfExporterTest {

    @Test
    void exportProducesPdfBytes() {
        List<ReportColumn> columns = List.of(
                new ReportColumn("CI", row -> ReportColumn.text(row.get("ci"))),
                new ReportColumn("Nombre", row -> ReportColumn.text(row.get("name"))));
        List<Map<String, Object>> rows = List.of(Map.of("ci", "V123", "name", "Ana Perez"));

        byte[] bytes = PdfExporter.exportMaps("Reporte de prueba", columns, rows);

        assertThat(bytes).isNotEmpty();
        assertThat(new String(bytes, 0, Math.min(bytes.length, 5), StandardCharsets.US_ASCII))
                .startsWith("%PDF-");
    }
}


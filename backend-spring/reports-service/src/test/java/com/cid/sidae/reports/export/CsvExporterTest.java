package com.cid.sidae.reports.export;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class CsvExporterTest {

    @Test
    void exportQuotesSpecialValues() {
        List<ReportColumn> columns = List.of(
                new ReportColumn("CI", row -> ReportColumn.text(row.get("ci"))),
                new ReportColumn("Nombre", row -> ReportColumn.text(row.get("name"))));
        List<Map<String, Object>> rows = List.of(
                Map.of("ci", "V123", "name", "Ana, \"La\" Perez"));

        String csv = new String(CsvExporter.export(columns, rows), StandardCharsets.UTF_8);

        assertThat(csv).startsWith("CI,Nombre\r\n");
        assertThat(csv).contains("V123,\"Ana, \"\"La\"\" Perez\"");
    }
}

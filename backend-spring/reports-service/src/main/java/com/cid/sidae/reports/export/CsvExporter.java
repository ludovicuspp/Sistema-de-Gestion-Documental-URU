package com.cid.sidae.reports.export;

import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;

/** CSV plano (RFC 4180) para interoperar con la importacion masiva. */
public final class CsvExporter {

    private CsvExporter() {
    }

    public static byte[] export(List<ReportColumn> columns, List<Map<String, Object>> rows) {
        String header = columns.stream().map(ReportColumn::header).map(CsvExporter::escape).collect(Collectors.joining(","));
        StringBuilder builder = new StringBuilder(header).append("\r\n");
        for (Map<String, Object> row : rows) {
            String line = columns.stream()
                    .map(column -> escape(column.value().apply(row)))
                    .collect(Collectors.joining(","));
            builder.append(line).append("\r\n");
        }
        return builder.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    private static String escape(String value) {
        if (value == null) {
            return "";
        }
        boolean quoted = value.contains(",") || value.contains("\"") || value.contains("\n") || value.contains("\r");
        String escaped = value.replace("\"", "\"\"");
        return quoted ? "\"" + escaped + "\"" : escaped;
    }
}


package com.cid.sidae.migration;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Contadores y errores del ETL para el reporte final. */
public class MigrationReport {

    public record TableReport(String table, int inserted, int skipped, List<String> errors) {
    }

    private final Map<String, TableCounter> counters = new LinkedHashMap<>();
    private final List<String> warnings = new ArrayList<>();

    public void inserted(String table) {
        counter(table).inserted++;
    }

    public void skipped(String table) {
        counter(table).skipped++;
    }

    public void error(String table, String message) {
        TableCounter counter = counter(table);
        counter.errors++;
        counter.details.add(message);
    }

    public void warn(String message) {
        warnings.add(message);
    }

    public List<TableReport> tables() {
        return counters.entrySet().stream()
                .map(entry -> new TableReport(entry.getKey(), entry.getValue().inserted,
                        entry.getValue().skipped, List.copyOf(entry.getValue().details)))
                .toList();
    }

    public List<String> warnings() {
        return List.copyOf(warnings);
    }

    public int totalErrors() {
        return counters.values().stream().mapToInt(counter -> counter.errors).sum();
    }

    private TableCounter counter(String table) {
        return counters.computeIfAbsent(table, name -> new TableCounter());
    }

    private static final class TableCounter {
        int inserted;
        int skipped;
        int errors;
        final List<String> details = new ArrayList<>();
    }
}

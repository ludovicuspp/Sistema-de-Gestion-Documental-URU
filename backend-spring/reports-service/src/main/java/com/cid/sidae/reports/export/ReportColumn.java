package com.cid.sidae.reports.export;

import java.util.Map;
import java.util.function.Function;

/** Definicion de columna compartida por los exportadores Excel/PDF/CSV. */
public record ReportColumn(String header, Function<Map<String, Object>, String> value) {

    public static String text(Object value) {
        return value == null ? "" : String.valueOf(value);
    }
}

package com.cid.sidae.reports.export;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/** Generacion de .xlsx tabulares a partir de filas genericas. */
public final class ExcelExporter {

    private ExcelExporter() {
    }

    public static byte[] export(String sheetName, List<ReportColumn> columns, List<Map<String, Object>> rows) {
        try (Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(sheetName);
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            Row header = sheet.createRow(0);
            for (int i = 0; i < columns.size(); i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(columns.get(i).header());
                cell.setCellStyle(headerStyle);
            }
            for (int r = 0; r < rows.size(); r++) {
                Row row = sheet.createRow(r + 1);
                Map<String, Object> data = rows.get(r);
                for (int c = 0; c < columns.size(); c++) {
                    row.createCell(c).setCellValue(columns.get(c).value().apply(data));
                }
            }
            for (int i = 0; i < columns.size(); i++) {
                sheet.autoSizeColumn(i);
                if (sheet.getColumnWidth(i) > 12000) {
                    sheet.setColumnWidth(i, 12000);
                }
            }
            workbook.write(output);
            return output.toByteArray();
        } catch (IOException ex) {
            throw new IllegalStateException("No fue posible generar el Excel.", ex);
        }
    }
}


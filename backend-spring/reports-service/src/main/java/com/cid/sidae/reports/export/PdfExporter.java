package com.cid.sidae.reports.export;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;


/** Generacion de PDF tabulares con OpenPDF. */
public final class PdfExporter {

    private PdfExporter() {
    }

    public static byte[] export(String title, List<ReportColumn> columns, List<List<String>> rows) {
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate(), 36, 36, 36, 36);
            PdfWriter.getInstance(document, output);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9);
            Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 9);

            Paragraph heading = new Paragraph(title, titleFont);
            heading.setAlignment(Element.ALIGN_CENTER);
            document.add(heading);
            Paragraph generated = new Paragraph("Generado: " + LocalDate.now(), subtitleFont);
            generated.setAlignment(Element.ALIGN_CENTER);
            document.add(generated);
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(columns.size());
            table.setWidthPercentage(100);
            for (ReportColumn column : columns) {
                table.addCell(new Phrase(column.header(), headerFont));
            }
            for (List<String> row : rows) {
                for (String value : row) {
                    table.addCell(new Phrase(value, cellFont));
                }
            }
            document.add(table);
            document.close();
            return output.toByteArray();
        } catch (Exception ex) {
            throw new IllegalStateException("No fue posible generar el PDF.", ex);
        }
    }

    public static byte[] exportMaps(String title, List<ReportColumn> columns, List<Map<String, Object>> rows) {
        List<List<String>> mapped = rows.stream()
                .map(row -> columns.stream().map(column -> column.value().apply(row)).toList())
                .toList();
        return export(title, columns, mapped);
    }
}


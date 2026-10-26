package com.cid.sidae.commons.mail;

/** Plantillas HTML de correo (sin dependencias: texto plano con estilo inline). */
public final class EmailTemplates {

    private EmailTemplates() {
    }

    private static String layout(String title, String body) {
        return """
                <html><body style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
                <div style="max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                <div style="background:#284483;color:#ffffff;padding:16px 24px;">
                <strong>Centro de Informaci\u00f3n y Documentaci\u00f3n (CID) - URU</strong>
                </div>
                <div style="padding:24px;">
                <h2 style="margin-top:0;">%s</h2>
                %s
                <p style="color:#6b7280;font-size:12px;">Universidad Rafael Urdaneta</p>
                </div></div></body></html>
                """.formatted(title, body);
    }

    private static String button(String url, String label) {
        return """
                <p><a href="%s" style="display:inline-block;background:#284483;color:#ffffff;\\
                text-decoration:none;padding:10px 20px;border-radius:6px;">%s</a></p>
                <p style="font-size:12px;color:#6b7280;">Si el bot\u00f3n no funciona, copie este enlace:<br/>%s</p>
                """.formatted(url, label, url);
    }

    public static String requestReadySubject() {
        return "Solicitud de documentos lista - CID URU";
    }

    public static String requestReadyBody(String fullName, String trackingCode) {
        return layout("Su solicitud esta lista",
                """
                        <p>Estimado(a) %s:</p>
                        <p>Su solicitud con codigo de seguimiento <strong>%s</strong> ha sido procesada.
                        Puede retirar sus documentos en el Centro de Informacion y Documentacion (CID) de la URU.</p>
                        """.formatted(escape(fullName), escape(trackingCode)));
    }

    public static String passwordResetSubject() {
        return "Recuperacion de contrasena - CID URU";
    }

    public static String passwordResetBody(String resetUrl) {
        return layout("Recupere su contrasena",
                """
                        <p>Recibimos una solicitud para restablecer la contrasena de su cuenta.</p>
                        <p>El enlace vence en <strong>1 hora</strong> y solo puede usarse una vez.</p>
                        """
                        + button(resetUrl, "Restablecer contrasena")
                        + "<p>Si usted no solicito este cambio, ignore este mensaje.</p>");
    }

    private static String escape(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}

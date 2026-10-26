package com.cid.sidae.requests.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;

    public NotificationService(
            JavaMailSender mailSender,
            @Value("${notifications.enabled:true}") boolean enabled,
            @Value("${notifications.from:no-reply@uru.edu.ve}") String from) {
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
    }

    /** CU-19: notifica al estudiante cuando su solicitud esta lista. */
    public void sendReadyNotification(String to, String fullName, String trackingCode) {
        if (!enabled) {
            log.info("Notificacion deshabilitada. Solicitud {} lista para {}", trackingCode, to);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject("Solicitud de documentos lista - CID URU");
            message.setText("""
                    Estimado(a) %s:

                    Su solicitud con codigo de seguimiento %s ha sido procesada.
                    Puede retirar sus documentos en el Centro de Informacion y Documentacion (CID) de la URU.

                    Universidad Rafael Urdaneta
                    """.formatted(fullName, trackingCode));
            mailSender.send(message);
        } catch (Exception ex) {
            log.error("No fue posible enviar el correo de la solicitud {}", trackingCode, ex);
        }
    }
}

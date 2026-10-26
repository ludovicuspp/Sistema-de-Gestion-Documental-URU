package com.cid.sidae.requests.service;

import com.cid.sidae.commons.mail.EmailTemplates;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(EmailTemplates.requestReadySubject());
            helper.setText(EmailTemplates.requestReadyBody(fullName, trackingCode), true);
            mailSender.send(message);
        } catch (Exception ex) {
            log.error("No fue posible enviar el correo de la solicitud {}", trackingCode, ex);
        }
    }
}

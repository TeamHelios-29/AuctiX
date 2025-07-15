package com.helios.auctix.services.notification.senders;

import com.helios.auctix.config.AuctixProperties;
import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.domain.notification.NotificationType;
import com.helios.auctix.services.EmailService;
import com.helios.auctix.services.notification.NotificationSender;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class EmailNotificationSender implements NotificationSender {

    private final EmailService emailService;
    private final AuctixProperties auctixProperties;

    public EmailNotificationSender(EmailService emailService, AuctixProperties auctixProperties) {
        this.emailService = emailService;
        this.auctixProperties = auctixProperties;
    }

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.EMAIL;
    }

    @Override
    public void sendNotification(Notification notification) {

        Map<String, Object> variables = new HashMap<>();
        variables.put("firstname", notification.getUser().getFirstName());
        variables.put("username", notification.getUser().getUsername());
        variables.put("notificationTitle", notification.getTitle());
        variables.put("notificationContent", notification.getContent());
        variables.put("preferencesUrl", auctixProperties.getFrontendUrl() + "/notifications/preferences");

        String fullUrl = buildFullUrl(notification.getPartialUrl());
        if (fullUrl != null) {
            variables.put("notificationUrl", fullUrl);
        }

        try {
            emailService.sendHtmlEmail(
                    notification.getUser().getEmail(),
                    notification.getTitle(),
                    "email/default-email",
                    variables
            );
//          TODO optionally we could save delivery status

        } catch (MessagingException e) {
            log.error("MessagingException: Failed to send email to {}: {}", notification.getUser().getEmail(), e.getMessage());
        } catch (MailException e) {
            log.error("MailException: Mail sending failed for {}: {}", notification.getUser().getEmail(), e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected exception while sending email for {}: {}", notification.getUser().getEmail(), e.getMessage());
        }
    }

    private String buildFullUrl(String relativeUrl) {
        return auctixProperties.convertToFullUrl(relativeUrl);
    }

}

package com.helios.auctix.services.notification.senders;

import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.repositories.NotificationRepository;
import com.helios.auctix.services.EmailService;
import com.helios.auctix.services.notification.NotificationSender;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Component
public class EmailNotificationSender implements NotificationSender {

    private final EmailService emailService;
    private final NotificationRepository notificationRepository;

    public EmailNotificationSender(EmailService emailService, NotificationRepository notificationRepository) {
        this.emailService = emailService;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void sendNotification(Notification notification) {
        System.out.println("Got the notification to send to email" + notification.toString());


        Map<String, Object> variables = Map.of("username", notification.getUser().getUsername());

        try {
            emailService.sendHtmlEmail(
                    notification.getUser().getEmail(),
                    notification.getTitle(),
                    "email/test-email",
                    variables
                    );


        notification.setSentAt(LocalDateTime.now());
        notificationRepository.save(notification);

        } catch (MessagingException e) {
                log.error("MessagingException: Failed to send email to {}: {}", notification.getUser().getEmail(), e.getMessage());
        } catch (MailException e) {
                log.error("MailException: Mail sending failed for {}: {}", notification.getUser().getEmail(), e.getMessage());
        } catch (Exception e) {
                log.error("Unexpected exception while sending email for {}: {}", notification.getUser().getEmail(), e.getMessage());
        }
    }
}

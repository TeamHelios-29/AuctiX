package com.helios.auctix.services.notification.senders;

import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.repositories.NotificationRepository;
import com.helios.auctix.services.EmailService;
import com.helios.auctix.services.notification.NotificationSender;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

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

        emailService.sendEmail(
                notification.getUser().getEmail(),
                notification.getTitle(),
                notification.getContent()
        );

        notification.setSentAt(LocalDateTime.now());
        notificationRepository.save(notification);

    }
}

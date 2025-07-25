package com.helios.auctix.services.notification.senders;

import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.domain.notification.NotificationType;
import com.helios.auctix.services.notification.NotificationPersistenceHelper;
import com.helios.auctix.services.notification.NotificationSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Deprecated
@Component
public class WebSocketNotificationSender implements NotificationSender {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationPersistenceHelper notificationPersistenceHelper;

    public WebSocketNotificationSender(SimpMessagingTemplate messagingTemplate, NotificationPersistenceHelper notificationPersistenceHelper) {
        this.messagingTemplate = messagingTemplate;
        this.notificationPersistenceHelper = notificationPersistenceHelper;
    }

    @Override
    public NotificationType getNotificationType() {
        return null;  // TODO decide if we are going to have both WebSocket Push and FCM Push, currently prioritizing FCM
    }

    @Override
    public void sendNotification(Notification notification) {

//        messagingTemplate.convertAndSendToUser(
//                notification.getUser().getUsername(),
//                "/queue/notifications",
//                notification
//        );

        notificationPersistenceHelper.finalizeAndSave(notification, getNotificationType());

    }
}

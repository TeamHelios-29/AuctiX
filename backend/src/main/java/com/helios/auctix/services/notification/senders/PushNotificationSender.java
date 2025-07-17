package com.helios.auctix.services.notification.senders;

import com.helios.auctix.config.AuctixProperties;
import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.domain.notification.NotificationType;
import com.helios.auctix.domain.user.UserFCMToken;
import com.helios.auctix.services.FirebaseCloudMessageService;
import com.helios.auctix.services.notification.NotificationSender;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PushNotificationSender implements NotificationSender {

    /*
     * Push notifications using Firebase Cloud Messaging
     *
     */

    private final FirebaseCloudMessageService firebaseCloudMessageService;
    private final AuctixProperties auctixProperties;

    public PushNotificationSender(FirebaseCloudMessageService firebaseCloudMessageService, AuctixProperties auctixProperties) {
        this.firebaseCloudMessageService = firebaseCloudMessageService;
        this.auctixProperties = auctixProperties;
    }


    @Override
    public NotificationType getNotificationType() {
        return NotificationType.PUSH;
    }

    @Override
    public void sendNotification(Notification notification) {

        List<UserFCMToken> fcmTokensForUser = firebaseCloudMessageService.getActiveFCMTokensForUser(notification.getUser());

        String url = notification.getPartialUrl();
        String fullUrl = auctixProperties.convertToFullUrl(url);

        // Send to all 'active' tokens, if the client is unregistered or token has been expired it will throw an exception
        // that will be handled by the FirebaseCloudMessageService and it will be removing the token from the database
        for (UserFCMToken userFCMToken : fcmTokensForUser) {
            firebaseCloudMessageService.sendNotification(
                    userFCMToken.getFcmToken(),
                    notification.getTitle(),
                    notification.getContent(),
                    fullUrl
            );
        }

        // TODO optionally we could save delivery status
    }
}

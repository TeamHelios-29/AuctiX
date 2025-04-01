package com.helios.auctix.services;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;

@Service
@Log
public class FirebaseCloudMessageService {

    public void sendNotification(String token, String title, String body) {
        Notification notification = Notification.builder()
                .setTitle(title)
                .setBody(body)
//                .setImage(imgUrl)
                .build();

        Message message = Message.builder()
                .setToken(token)  // FCM device token
                .setNotification(notification)
                .build();

        try {
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Successfully sent message: " + response);
        } catch (Exception e) {
            log.severe("Error sending FCM message: " + e.getMessage());
        }
    }
}

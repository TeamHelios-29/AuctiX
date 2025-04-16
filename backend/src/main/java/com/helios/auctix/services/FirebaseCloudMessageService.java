package com.helios.auctix.services;

import com.google.firebase.messaging.*;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.user.UserFCMToken;
import com.helios.auctix.repositories.UserFCMTokenRepository;
import jakarta.transaction.Transactional;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Log
public class FirebaseCloudMessageService {

    private final UserFCMTokenRepository tokenRepository;

    public FirebaseCloudMessageService(UserFCMTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

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
        } catch (FirebaseMessagingException e) {

            // if the FCM token expires or the client unregisters
            if (e.getMessagingErrorCode() == MessagingErrorCode.UNREGISTERED) {
                // Remove the token from the users fcm tokens
                removeToken(token);
            } else {
                // for other errors including service unavailability
                log.severe("Error sending FCM message: " + e.getMessage());
            }
        }
    }

    /**
     * Registering the Firebase Cloud Messaging device tokens to the users.
     * The user can log in from multiple devices.
     * If two users use the same token that user will not be registered in the system
     *
     * @param user
     * @param token Firebase Cloud Messaging token. This will be available in the frontend when the user allows
     *              notifications and the service worker is registered successfully.
     * @param deviceUserAgent
     */
    @Transactional
    public void registerToken(User user, String token, String deviceUserAgent) {
        Optional<UserFCMToken> optionalToken = tokenRepository.findByFcmToken(token);

        if (optionalToken.isPresent()) {
            UserFCMToken existingToken = optionalToken.get();

            // If the token is already assigned to this user, update any metadata
            if (existingToken.getUser().getId().equals(user.getId())) {
                existingToken.setIsActive(true);
                existingToken.setDeviceUserAgent(deviceUserAgent);
                existingToken.setLastUsedAt(Instant.now());
                tokenRepository.save(existingToken);
            } else {
                // Token is being reused by another user - (could happen if another user logs to the same device and token is not invalidated)
                log.warning("FCM token is already in use by a different user. Ignoring registration.");
                throw new IllegalStateException("FCM token is already in use by a different user: " + existingToken.getUser().getEmail() + " new request by: " + user.getEmail());
            }

        } else {
            // It is a new token, create it in database
            UserFCMToken newToken = UserFCMToken.builder()
                    .user(user)
                    .fcmToken(token)
                    .deviceUserAgent(deviceUserAgent)
                    .createdAt(Instant.now())
                    .lastUsedAt(Instant.now())
                    .isActive(true)
                    .build();

            tokenRepository.save(newToken);
        }
    }

    public void removeToken(String token) {
        tokenRepository.findByFcmToken(token).ifPresent(tokenRepository::delete);
    }

    public List<UserFCMToken> getActiveFCMTokensForUser(User user) {
        return tokenRepository.findAllByUserIdAndIsActive(user.getId(), true);
    }
}

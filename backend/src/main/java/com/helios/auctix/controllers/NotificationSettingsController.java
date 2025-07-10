package com.helios.auctix.controllers;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.FCMTokenRegisterRequestDTO;
import com.helios.auctix.dtos.notification.NotificationPreferencesResponseDto;
import com.helios.auctix.dtos.notification.NotificationPreferenceUpdateDto;
import com.helios.auctix.services.FirebaseCloudMessageService;
import com.helios.auctix.services.notification.NotificationSettingsService;
import com.helios.auctix.services.user.UserRegisterService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping("api/notification/settings")
public class NotificationSettingsController {

    private final FirebaseCloudMessageService firebaseCloudMessageService;
    private final UserRegisterService userRegisterService;
    private final NotificationSettingsService notificationSettingsService;
    private final Logger log = Logger.getLogger(NotificationSettingsController.class.getName());

    public NotificationSettingsController(FirebaseCloudMessageService firebaseCloudMessageService, UserRegisterService userRegisterService, NotificationSettingsService notificationSettingsService) {
        this.firebaseCloudMessageService = firebaseCloudMessageService;
        this.userRegisterService = userRegisterService;
        this.notificationSettingsService = notificationSettingsService;
    }


    @PostMapping("/set-device-fcm-token")
    public ResponseEntity<String> setUserDeviceFCMToken(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody FCMTokenRegisterRequestDTO fcmRegisterRequestDTO,
            @RequestHeader(value = HttpHeaders.USER_AGENT) String userAgent
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
        }

        String userEmail = userDetails.getUsername();

        try {
            User user = userRegisterService.getUserFromEmail(userEmail);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }


            firebaseCloudMessageService.registerToken(
                    user,
                    fcmRegisterRequestDTO.getFcmToken(),
                    userAgent
            );

            return ResponseEntity.ok("FCM token saved successfully");

        } catch (Exception e) {
            log.log(Level.SEVERE, "Error occurred while registering FCM token", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the request request");
        }
    }

    @GetMapping("/preferences")
    public ResponseEntity<NotificationPreferencesResponseDto> getNotificationPreferences(
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String userEmail = userDetails.getUsername();

        try {
            User user = userRegisterService.getUserFromEmail(userEmail);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            NotificationPreferencesResponseDto preferences = notificationSettingsService.getPreferences(user);
            return ResponseEntity.ok(preferences);

        } catch (Exception e) {
            log.log(Level.SEVERE, "Error occurred while fetching notification preferences", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/preferences")
    public ResponseEntity<String> setNotificationPreferences(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody NotificationPreferenceUpdateDto dto) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
        }

        String userEmail = userDetails.getUsername();

        try {
            User user = userRegisterService.getUserFromEmail(userEmail);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            notificationSettingsService.savePreferences(user, dto);

            return ResponseEntity.ok("Notification preferences updated successfully");

        } catch (Exception e) {
            log.log(Level.SEVERE, "Error occurred while updating notification preferences", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the request");
        }
    }






}

package com.helios.auctix.controllers;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.FCMTokenRegisterRequestDTO;
import com.helios.auctix.services.FirebaseCloudMessageService;
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
    private final Logger log = Logger.getLogger(NotificationSettingsController.class.getName());

    public NotificationSettingsController(FirebaseCloudMessageService firebaseCloudMessageService, UserRegisterService userRegisterService) {
        this.firebaseCloudMessageService = firebaseCloudMessageService;
        this.userRegisterService = userRegisterService;
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

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid data: " + e.getMessage());
        } catch (Exception e) {
            log.log(Level.SEVERE, "Error registering FCM for user " + userEmail, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
        }
    }

}

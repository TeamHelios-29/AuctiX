package com.helios.auctix.controllers;

import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.NotificationResponseDto;
import com.helios.auctix.services.notification.UserNotificationService;
import com.helios.auctix.services.user.UserDetailsService;
import jakarta.validation.constraints.Min;
import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    private final UserNotificationService notificationService;
    private final UserDetailsService userDetailsService;

    public NotificationController(UserNotificationService notificationService, UserDetailsService userDetailsService) {
        this.notificationService = notificationService;
        this.userDetailsService = userDetailsService;
    }

    @GetMapping("/")
    public Page<NotificationResponseDto> getNotifications(
            @RequestParam(defaultValue = "false") boolean onlyUnread,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size,
            @RequestParam(required = false) String notificationCategory
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            User user = userDetailsService.getAuthenticatedUser(authentication);
            return notificationService.getUserNotifications(user.getId(), onlyUnread, page, size, notificationCategory);
        } catch (AuthenticationException e) {
            throw new RuntimeException("User not authenticated");
        }
    }

    @GetMapping("/categories")
    public List<String> getNotificationCategories() {
        return Arrays.stream(NotificationCategory.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    @GetMapping("/unread-count")
    public long getUnreadCount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            User user = userDetailsService.getAuthenticatedUser(authentication);
            return notificationService.getUnreadNotificationCount(user.getId());
        } catch (AuthenticationException e) {
            throw new RuntimeException("User not authenticated");
        }
    }

    @PostMapping("/{id}/read")
    public void markAsRead(@PathVariable UUID id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            User user = userDetailsService.getAuthenticatedUser(authentication);
            notificationService.markAsRead(id, user.getId());
        } catch (AuthenticationException e) {
            throw new RuntimeException("User not authenticated");
        }
    }

    @PostMapping("/{id}/unread")
    public void markAsUnread(@PathVariable UUID id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            User user = userDetailsService.getAuthenticatedUser(authentication);
            notificationService.markAsUnread(id, user.getId());
        } catch (AuthenticationException e) {
            throw new RuntimeException("User not authenticated");
        }
    }

    @PostMapping("/mark-all-read")
    public void markAllAsRead() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            User user = userDetailsService.getAuthenticatedUser(authentication);
            notificationService.markAllAsRead(user.getId());
        } catch (AuthenticationException e) {
            throw new RuntimeException("User not authenticated");
        }
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable UUID id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            User user = userDetailsService.getAuthenticatedUser(authentication);
            notificationService.deleteNotification(id, user.getId());
        } catch (AuthenticationException e) {
            throw new RuntimeException("User not authenticated");
        }
    }
}

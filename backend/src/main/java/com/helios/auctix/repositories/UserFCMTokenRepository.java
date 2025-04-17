package com.helios.auctix.repositories;

import com.helios.auctix.domain.user.UserFCMToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserFCMTokenRepository extends JpaRepository<UserFCMToken, UUID> {
    Optional<UserFCMToken> findByFcmToken(String fcmToken);
    List<UserFCMToken> findAllByUserIdAndIsActive(UUID userId, boolean isActive);
    void deleteByFcmToken(String fcmToken);
}

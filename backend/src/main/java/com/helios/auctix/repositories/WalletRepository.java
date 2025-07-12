package com.helios.auctix.repositories;

import com.helios.auctix.domain.transaction.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, UUID> {

    List<Wallet> findAllByUserId(UUID userId);  // Add this method to get all wallets for a user
    Optional<Wallet> findByUserId(UUID userId);
}


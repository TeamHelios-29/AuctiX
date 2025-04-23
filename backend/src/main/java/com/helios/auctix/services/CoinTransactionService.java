package com.helios.auctix.services;

import com.helios.auctix.domain.transaction.Transaction;
import com.helios.auctix.domain.transaction.Wallet;
import com.helios.auctix.dtos.TransactionResponseDTO;
import com.helios.auctix.repositories.TransactionRepository;
import com.helios.auctix.repositories.WalletRepository;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CoinTransactionService {

    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;

    @Autowired
    public CoinTransactionService(TransactionRepository transactionRepository, WalletRepository walletRepository) {
        this.transactionRepository = transactionRepository;
        this.walletRepository = walletRepository;
    }

    @Transactional
    public TransactionResponseDTO createWallet(UUID userId) {
        // Check if wallet already exists for the user
        boolean walletExists = walletRepository.findByUserId(userId).isPresent();
        if (walletExists) {
            throw new RuntimeException("Wallet already exists for user ID: " + userId);
        }

        Wallet wallet = Wallet.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .amount(BigDecimal.valueOf(10000))
                .freezeAmount(BigDecimal.ZERO)
                .transactionType("INITIAL")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Wallet savedWallet = walletRepository.save(wallet);

        return TransactionResponseDTO.builder()
                .id(savedWallet.getId())
                .walletId(savedWallet.getId())
                .amount(savedWallet.getAmount())
                .freezeAmount(savedWallet.getFreezeAmount())
                .transactionType(savedWallet.getTransactionType())
                .createdAt(savedWallet.getCreatedAt())
                .updatedAt(savedWallet.getUpdatedAt())
                .build();
    }

    @Transactional
    public TransactionResponseDTO freezeAmount(UUID userId, double freezeAmount) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found for user ID: " + userId));

        BigDecimal freezeValue = BigDecimal.valueOf(freezeAmount);

        if (wallet.getAmount().compareTo(freezeValue) < 0) {
            throw new IllegalArgumentException("Insufficient wallet balance to freeze the requested amount");
        }

        // Deduct from available balance and update freeze amount
        wallet.setAmount(wallet.getAmount().subtract(freezeValue));
        wallet.setFreezeAmount(wallet.getFreezeAmount().add(freezeValue));
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);

        // Create transaction record
        Transaction transaction = Transaction.builder()
                .wallet(wallet)
                .amount(freezeValue)
                .status("FREEZED")
                .transactionDate(LocalDateTime.now())
                .build();

        transactionRepository.save(transaction);

        return TransactionResponseDTO.builder()
                .id(transaction.getId())
                .walletId(wallet.getId())
                .amount(transaction.getAmount())
                .freezeAmount(wallet.getFreezeAmount())
                .status(transaction.getStatus())
                .description("Amount frozen and transaction created")
                .createdAt(transaction.getTransactionDate())
                .updatedAt(wallet.getUpdatedAt())
                .build();
    }


    @Transactional
    public TransactionResponseDTO processTransaction(UUID transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with ID: " + transactionId));

        // Set status to FROZEN and update wallet freeze amount
        transaction.setStatus("FROZEN");
        Wallet wallet = transaction.getWallet();
        wallet.setFreezeAmount(wallet.getFreezeAmount().add(transaction.getAmount()));
        wallet.setUpdatedAt(LocalDateTime.now());

        transactionRepository.save(transaction);
        walletRepository.save(wallet);

        return mapToDTO(transaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponseDTO> getTransactionHistory(UUID userId) {
        Optional<Wallet> wallets = walletRepository.findByUserId(userId);
        return wallets.stream()
                .flatMap(wallet -> wallet.getTransactions().stream())
                .sorted((a, b) -> b.getTransactionDate().compareTo(a.getTransactionDate()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private TransactionResponseDTO mapToDTO(Transaction transaction) {
        return TransactionResponseDTO.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .status(transaction.getStatus())
                .description(transaction.getDescription())
                .transactionDate(transaction.getTransactionDate())
                .walletId(transaction.getWallet().getId())
                .build();
    }
}

package com.helios.auctix.services;

import com.helios.auctix.domain.transaction.CoinTransaction;
import com.helios.auctix.dtos.TransactionResponseDTO;
import com.helios.auctix.repositories.CoinTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CoinTransactionService {

    private final CoinTransactionRepository transactionRepository;

    @Autowired
    public CoinTransactionService(CoinTransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public TransactionResponseDTO processTransaction(Long transactionId) {
        CoinTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with ID: " + transactionId));

        // Set transaction status to FROZEN
        transaction.setStatus("FROZEN");
        transaction.setFreezeAmount(transaction.getAmount()); // Freeze the entire amount
        transaction.setUpdatedAt(LocalDateTime.now());

        CoinTransaction savedTransaction = transactionRepository.save(transaction);

        return mapToDTO(savedTransaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponseDTO> getTransactionHistory(UUID userId) {
        List<CoinTransaction> transactions = transactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return transactions.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private TransactionResponseDTO mapToDTO(CoinTransaction transaction) {
        return TransactionResponseDTO.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .freezeAmount(transaction.getFreezeAmount())
                .status(transaction.getStatus())
                .transactionType(transaction.getTransactionType())
                .description(transaction.getDescription())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
}

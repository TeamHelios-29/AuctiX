package com.helios.auctix.dtos;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionResponseDTO {
    private UUID id; // Transaction ID
    private UUID walletId; // Associated wallet ID
    private BigDecimal amount; // Total amount in wallet
    private BigDecimal freezeAmount; // Amount frozen in wallet
    private String status; // Status of the wallet (e.g., FROZEN, ACTIVE)
    private String transactionType; // Type of transaction (e.g., FREEZE, PURCHASE)
    private String description; // Description of the transaction
    private LocalDateTime transactionDate; // Date and time of the transaction
    private LocalDateTime createdAt; // Created timestamp
    private LocalDateTime updatedAt; // Last updated timestamp
}
